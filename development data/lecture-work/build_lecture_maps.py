# -*- coding: utf-8 -*-
"""
Build per-subject lecture maps + master index from ../Lessons/ (21 folders).

No LLM. Accuracy-first: mark low confidence as needs_review.
Caches extracted page text under maps/_extract_cache/.
"""

from __future__ import annotations

import hashlib
import json
import re
import unicodedata
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
LESSONS = ROOT.parent / "Lessons"
MAPS = ROOT / "maps"
CACHE = MAPS / "_extract_cache"
HIERARCHY = ROOT / "HIERARCHY.md"

# Subject folder number → default 1st-contour section ids (soft prior)
SUBJECT_SECTION_PRIOR: dict[int, list[str]] = {
    1: ["hazardous_work"],
    2: ["ecology"],
    3: ["emergency_response", "first_aid"],
    4: ["rights_regulation"],
    5: ["civil_protection", "emergency_response"],
    6: ["working_conditions"],
    7: ["ppe_protection"],
    8: ["hazardous_work"],
    9: ["hazardous_work", "working_conditions"],
    10: ["accident_investigation"],
    11: ["working_conditions", "accident_investigation"],
    12: ["documentation", "preparation_admission"],
    13: ["hazardous_work", "preparation_admission"],
    14: ["risk_monitoring", "emergency_response"],
    15: ["working_conditions"],
    16: ["civil_protection"],
    17: ["hazardous_work"],
    18: ["working_conditions"],
    19: ["risk_monitoring"],
    20: ["fire_explosion"],
    21: ["civil_protection", "rights_regulation"],
}

# Anchor detectors: id, UA label, regex, optional hierarchy situation codes
ANCHORS: list[tuple[str, str, str, list[str]]] = [
    ("instruktazh", "Інструктажі", r"інструктаж", ["1.1", "2.5", "2.6", "2.7"]),
    ("medogliad", "Медогляди", r"медогляд|медичн\w* огляд", ["1.2", "2.9", "2.10"]),
    ("elektro_grupa", "Групи з електробезпеки", r"електробезпек|I\s*груп|і\s*груп\w* з електро", ["1.3"]),
    ("navchannia_op", "Навчання / перевірка знань з ОП", r"перевірк\w* знань|спеціальн\w* навчан|навчанн\w* з питань охорони праці", ["1.4", "1.5", "2.8"]),
    ("stazhuvannia", "Стажування / дублювання", r"стажуван|дублюван", ["1.6"]),
    ("nariad", "Наряд-допуск", r"наряд[-\s]?допуск", ["1.7", "2.14", "6.1"]),
    ("zhurnal", "Журнали обліку", r"журнал", ["2.5", "2.6"]),
    ("nakaz", "Накази з ОП", r"наказ\w* з охорони праці|накази з охорони", ["2.2"]),
    ("instruktsiia_op", "Інструкції з ОП", r"інструкці\w* з охорони праці", ["2.3"]),
    ("polozhennia", "Положення / СУОП", r"положення про|суоп|система управлінн\w* охороною праці", ["2.4"]),
    ("protokol_znan", "Протоколи перевірки знань", r"протокол\w*.{0,40}перевірк", ["2.8"]),
    ("karta_siz", "Картка обліку ЗІЗ", r"особист\w* картк|картк\w* обліку.{0,20}зіз|картк\w*.{0,20}сіз", ["2.11", "5.1"]),
    ("normy_siz", "Норми видачі ЗІЗ", r"норм\w*.{0,30}видач|безоплатн\w* видач", ["2.12", "5.2"]),
    ("dozvil", "Дозвільні документи", r"дозвіл\w*.{0,40}охорон|виконання робіт підвищеної", ["2.13"]),
    ("povidomlennia_nv", "Повідомлення про НВ", r"повідомленн\w*.{0,30}нещасн", ["2.15", "9.1"]),
    ("akt_n1", "Акти розслідування / Н-1", r"\bн-?1\b|акт.{0,30}розслідуван", ["2.16"]),
    ("atestatsiia", "Атестація / оцінка умов праці", r"атестаці\w* робоч|оцінк\w* умов праці", ["2.17", "4.1"]),
    ("prava_pracivnyka", "Права працівника з ОП", r"права працівник", ["3.1", "3.2"]),
    ("oboviazky_robotodavtsia", "Обовʼязки роботодавця", r"обов.?язк\w* роботодав", ["3.4", "1.8"]),
    ("oboviazky_pracivnyka", "Обовʼязки працівника", r"обов.?язк\w* працівник", ["3.5", "1.9"]),
    ("sluzhba_op", "Служба охорони праці", r"служба охорони праці", ["3.6"]),
    ("vidpovidalnist", "Відповідальність за порушення ОП", r"відповідальн\w*.{0,40}охорон\w* праці", ["3.12"]),
    ("kzpp", "Трудове право / КЗпП", r"кзпп|трудов\w* договір|трудов\w* правовіднос", ["3.14", "3.17"]),
    ("shum", "Шум", r"\bшум\b|шумов", ["4.5"]),
    ("vibratsiia", "Вібрація", r"вібрац", ["4.6"]),
    ("osvitlennia", "Освітлення", r"освітлен", ["4.7"]),
    ("mikroklimat", "Мікроклімат", r"мікроклімат", ["4.4"]),
    ("povitria", "Повітря робочої зони", r"повітря робочої|гдк|аерозол", ["4.8"]),
    ("ergonomika", "Ергономіка", r"ергоном", ["4.17", "4.20", "7.11"]),
    ("siz", "ЗІЗ", r"\bзіз\b|\bсіз\b|засоб\w* індивідуальн\w* захист", ["5.1", "5.2", "5.3"]),
    ("zkz", "ЗКЗ / колективний захист", r"\bзкз\b|колективн\w* захист", ["5.10"]),
    ("vysota", "Роботи на висоті", r"на висоті|верхолаз|альпініст", ["6.2"]),
    ("vantazh", "Вантажопідіймальні", r"вантажопідіймаль|кран\w*|стропаль", ["6.3"]),
    ("elektroustanovky", "Електроустановки", r"електроустанов|електробезпек", ["6.4", "1.3"]),
    ("loto", "LOTO / блокування енергії", r"\bloto\b|блокуванн\w*.{0,20}енерг|маркуванн\w*.{0,20}енерг", ["6.14"]),
    ("ryzyk", "Оцінка ризиків", r"оцінк\w* ризик|ідентифікаці\w* небезпек|ризик-орієнтов", ["7.1", "7.2", "7.3"]),
    ("reestr_nebezpek", "Реєстр небезпек / матриця", r"реєстр небезпек|матриц\w* ризик|карт\w* ризик", ["7.4"]),
    ("ns", "Надзвичайні ситуації", r"надзвичайн\w* ситуац|\bнс\b", ["7.7", "7.8", "8.1"]),
    ("opn", "ОПН", r"об.?єкт\w* підвищеної небезпек|\bопн\b", ["7.10", "11.1"]),
    ("plla", "ПЛЛА", r"\bпла\b|\bплаа\b|план ліквідувац|план локалізац", ["8.2", "11.2"]),
    ("evakuatsiia", "Евакуація", r"евакуац", ["8.3"]),
    ("rozsliduvannia", "Розслідування НВ / аварій", r"розслідуван", ["9.1", "9.2"]),
    ("persha_dopomoha", "Перша допомога", r"перш\w* допомог|домедичн", ["10.1"]),
    ("czyvilnyi", "Цивільний захист", r"цивільн\w* захист|\bцз\b", ["11.1"]),
    ("pozhezha", "Пожежна безпека", r"пожеж|вибух", ["12.1"]),
    ("ekolohiia", "Екологія / довкілля", r"еколог|довкілл", ["13.1"]),
    ("povedinka", "Поведінка / психологія безпеки", r"поведінков|психолог\w* безпек|культур\w* безпек", ["14.1"]),
]

NPA_RE = re.compile(
    r"(?:закон укра|кодекс|наказ|постанова|дсту|dstu|дбн|нпаоп|iso\s*\d)",
    re.I,
)
FORM_RE = re.compile(r"(?:журнал|акт\b|форма\b|бланк|картка|протокол|наряд)", re.I)
ROLE_RE = re.compile(
    r"(?:роботодавець|працівник|комісія|служба охорони|майстер|керівник)",
    re.I,
)
ALGO_RE = re.compile(
    r"(?:порядок|алгоритм|етап\w*|крок\w*|послідовність|процедура)",
    re.I,
)

THEME_LINE_RE = re.compile(
    r"^(?:тема|лекція|лекц\.?|розділ|module|модуль)\s*№?\s*(\d+[а-яa-z]?)\s*[.:=\-–—]?\s*(.*)$",
    re.I,
)
PAGE_HDR_RE = re.compile(r"^##\s+Сторінка\s+(\d+)\s*$", re.M)


def slugify(text: str, max_len: int = 60) -> str:
    table = {
        "а": "a", "б": "b", "в": "v", "г": "h", "ґ": "g", "д": "d", "е": "e",
        "є": "ie", "ж": "zh", "з": "z", "и": "y", "і": "i", "ї": "i", "й": "i",
        "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r",
        "с": "s", "т": "t", "у": "u", "ф": "f", "х": "kh", "ц": "ts", "ч": "ch",
        "ш": "sh", "щ": "shch", "ь": "", "ю": "iu", "я": "ia", "ы": "y", "э": "e",
        "ъ": "",
    }
    t = text.lower().strip()
    out = []
    for ch in t:
        if ch in table:
            out.append(table[ch])
        elif "a" <= ch <= "z" or "0" <= ch <= "9":
            out.append(ch)
        elif ch in " -_.":
            out.append("-")
    s = re.sub(r"-+", "-", "".join(out)).strip("-")
    return s[:max_len] or "item"


def parse_hierarchy() -> dict[str, Any]:
    text = HIERARCHY.read_text(encoding="utf-8") if HIERARCHY.exists() else ""
    sections: dict[str, dict[str, Any]] = {}
    situations: dict[str, dict[str, Any]] = {}
    current_sec: str | None = None
    for line in text.splitlines():
        m_sec = re.match(r"^##\s+(\d+)\.\s+(.+?)\s+`([a-z_]+)`\s*$", line)
        if m_sec:
            current_sec = m_sec.group(3)
            sections[current_sec] = {
                "order": int(m_sec.group(1)),
                "title": m_sec.group(2).strip(),
                "id": current_sec,
            }
            continue
        m_row = re.match(r"^\|\s*(\d+\.\d+)\s*\|\s*([^|]+)\|", line)
        if m_row and current_sec:
            code = m_row.group(1)
            title = m_row.group(2).strip()
            if title.startswith("---") or code == "#":
                continue
            situations[code] = {
                "code": code,
                "title": title,
                "sectionId": current_sec,
                "sectionOrder": sections[current_sec]["order"],
            }
    return {"sections": sections, "situations": situations}


def classify_file(name: str, rel: str) -> dict[str, Any]:
    n = name.lower()
    reasons: list[str] = []
    kind = "lecture_candidate"
    confidence = "medium"

    if any(x in n for x in ("автосохран", "autosave")):
        kind, confidence, reasons = "duplicate", "high", ["autosave"]
    elif re.search(r"\(\d+\)\.", n) or " копия" in n or " copy" in n:
        kind, confidence, reasons = "duplicate_suspect", "medium", ["numbered_copy"]
    elif any(x in n for x in ("тест", "test", "zadach", "задач")):
        kind, confidence, reasons = "test", "high", ["filename"]
    elif any(
        x in n
        for x in (
            "практич",
            "пр ",
            "пр_",
            " pz",
            "pz ",
            "pz_",
            "лаборатор",
            "завдання",
        )
    ) or re.match(r"^(pr|pz|пр)\b", n):
        kind, confidence, reasons = "practice", "high", ["filename"]
    elif any(
        x in n
        for x in (
            "dstu",
            "дсту",
            "дбн",
            "dbn",
            "наказ",
            "постанов",
            "закон",
            "кодекс",
            "нпаоп",
            "standart",
            "standard",
        )
    ):
        kind, confidence, reasons = "npa_or_standard", "high", ["filename"]
    elif any(x in n for x in ("лекц", "тема", "конспект", "през")):
        kind, confidence, reasons = "lecture", "high", ["filename"]
    else:
        reasons = ["default_candidate"]

    return {"kind": kind, "kindConfidence": confidence, "kindReasons": reasons}


def extract_pages(path: Path) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    """Return pages [{page, text, charCount}] and meta."""
    ext = path.suffix.lower()
    meta: dict[str, Any] = {"format": ext, "extractor": None, "error": None}
    pages: list[dict[str, Any]] = []

    try:
        if ext == ".pdf":
            import fitz  # PyMuPDF

            meta["extractor"] = "pymupdf"
            doc = fitz.open(path)
            try:
                for i, page in enumerate(doc, start=1):
                    text = page.get_text("text") or ""
                    pages.append({"page": i, "text": text, "charCount": len(text)})
            finally:
                doc.close()
        elif ext == ".pptx":
            from pptx import Presentation

            meta["extractor"] = "python-pptx"
            prs = Presentation(str(path))
            for i, slide in enumerate(prs.slides, start=1):
                chunks: list[str] = []
                for shape in slide.shapes:
                    if hasattr(shape, "text") and shape.text:
                        chunks.append(shape.text)
                text = "\n".join(chunks)
                pages.append({"page": i, "text": text, "charCount": len(text)})
        elif ext in {".docx", ".doc"}:
            if ext == ".doc":
                meta["extractor"] = "unsupported"
                meta["error"] = "legacy .doc not extracted"
                return pages, meta
            from docx import Document

            meta["extractor"] = "python-docx"
            doc = Document(str(path))
            # Approximate "pages" by splitting on empty paragraphs / headings batches
            paras = [p.text.strip() for p in doc.paragraphs if p.text and p.text.strip()]
            if not paras:
                pages.append({"page": 1, "text": "", "charCount": 0})
            else:
                # chunk ~40 paragraphs per pseudo-page for mapping granularity
                chunk_size = 40
                for i in range(0, len(paras), chunk_size):
                    chunk = "\n".join(paras[i : i + chunk_size])
                    pages.append(
                        {
                            "page": i // chunk_size + 1,
                            "text": chunk,
                            "charCount": len(chunk),
                        }
                    )
        else:
            meta["error"] = f"unsupported format {ext}"
    except Exception as exc:  # noqa: BLE001 — map build must continue
        meta["error"] = f"{type(exc).__name__}: {exc}"

    return pages, meta


def cache_key(path: Path) -> str:
    st = path.stat()
    raw = f"{path.resolve()}|{st.st_size}|{int(st.st_mtime)}"
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:16]


def load_or_extract(subject_id: str, path: Path) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    cdir = CACHE / subject_id
    cdir.mkdir(parents=True, exist_ok=True)
    key = cache_key(path)
    cpath = cdir / f"{key}.json"
    if cpath.exists():
        data = json.loads(cpath.read_text(encoding="utf-8"))
        return data["pages"], data["meta"]

    pages, meta = extract_pages(path)
    payload = {
        "source": str(path.relative_to(LESSONS)).replace("\\", "/"),
        "cachedAt": datetime.now(timezone.utc).isoformat(),
        "meta": meta,
        "pages": pages,
    }
    cpath.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    return pages, meta


def detect_themes(pages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Detect theme/lecture headers and page ranges."""
    hits: list[tuple[int, str, str]] = []  # page, num, title
    for p in pages:
        for raw in (p["text"] or "").splitlines():
            line = unicodedata.normalize("NFKC", raw).strip()
            line = re.sub(r"\s+", " ", line)
            if not line or len(line) > 180:
                continue
            m = THEME_LINE_RE.match(line)
            if m:
                num = m.group(1)
                title = (m.group(2) or "").strip(" .-–—:")
                hits.append((p["page"], num, title or line))
                break
            # filename-like slide title: "Тема 8. ..." already covered
            if re.match(r"^тема\s+\d+", line, re.I) and len(line) < 160:
                m2 = re.match(r"^тема\s+№?\s*(\d+[а-яa-z]?)\s*[.:=\-–—]?\s*(.*)$", line, re.I)
                if m2:
                    hits.append((p["page"], m2.group(1), (m2.group(2) or "").strip()))

    # Deduplicate consecutive same theme num
    themes: list[dict[str, Any]] = []
    for page, num, title in hits:
        if themes and themes[-1]["num"] == num and themes[-1]["title"] == title:
            continue
        if themes and themes[-1]["num"] == num and not title:
            continue
        themes.append(
            {
                "num": num,
                "title": title,
                "startPage": page,
                "endPage": None,
                "label": f"Тема/лекція {num}" + (f": {title}" if title else ""),
            }
        )

    if not themes and pages:
        # Fallback: one bucket for whole file
        return [
            {
                "num": "?",
                "title": "(без явного заголовка теми)",
                "startPage": 1,
                "endPage": pages[-1]["page"],
                "label": "Весь файл (тема не детектована)",
                "detection": "fallback_whole_file",
            }
        ]

    for i, th in enumerate(themes):
        if i + 1 < len(themes):
            th["endPage"] = max(th["startPage"], themes[i + 1]["startPage"] - 1)
        else:
            th["endPage"] = pages[-1]["page"] if pages else th["startPage"]
        th["detection"] = "header_regex"
        th["pageCount"] = th["endPage"] - th["startPage"] + 1
        # word estimate
        wc = 0
        for p in pages:
            if th["startPage"] <= p["page"] <= th["endPage"]:
                wc += len((p["text"] or "").split())
        th["wordCount"] = wc
        th["volume"] = volume_label(wc, th["pageCount"])

    return themes


def volume_label(words: int, pages: int) -> str:
    if words >= 2500 or pages >= 25:
        return "high"
    if words >= 800 or pages >= 8:
        return "medium"
    if words >= 150 or pages >= 2:
        return "low"
    return "thin"


def scan_anchors(
    pages: list[dict[str, Any]],
    hierarchy: dict[str, Any],
    page_from: int | None = None,
    page_to: int | None = None,
) -> list[dict[str, Any]]:
    situations = hierarchy["situations"]
    found: list[dict[str, Any]] = []
    for aid, label, pattern, sit_codes in ANCHORS:
        cre = re.compile(pattern, re.I)
        page_hits: list[int] = []
        samples: list[str] = []
        for p in pages:
            if page_from is not None and p["page"] < page_from:
                continue
            if page_to is not None and p["page"] > page_to:
                continue
            text = p["text"] or ""
            if not cre.search(text):
                continue
            page_hits.append(p["page"])
            if len(samples) < 2:
                # short context line
                for ln in text.splitlines():
                    if cre.search(ln) and 20 <= len(ln.strip()) <= 160:
                        samples.append(ln.strip())
                        break
        if not page_hits:
            continue
        suggested = []
        for code in sit_codes:
            sit = situations.get(code)
            if not sit:
                # TBD sections 8–14 may lack rows — still suggest code
                suggested.append(
                    {
                        "code": code,
                        "title": situations.get(code, {}).get("title"),
                        "sectionId": situations.get(code, {}).get("sectionId"),
                        "confidence": "high" if sit else "low",
                        "note": None if sit else "situation_row_missing_in_HIERARCHY",
                    }
                )
            else:
                suggested.append(
                    {
                        "code": code,
                        "title": sit["title"],
                        "sectionId": sit["sectionId"],
                        "confidence": "high",
                        "note": None,
                    }
                )
        found.append(
            {
                "id": aid,
                "label": label,
                "hitPages": page_hits[:40],
                "hitCount": len(page_hits),
                "samples": samples,
                "suggestedSituations": suggested,
            }
        )
    return found


def content_signals(pages: list[dict[str, Any]]) -> dict[str, Any]:
    full = "\n".join(p["text"] or "" for p in pages)
    return {
        "npaMentions": len(NPA_RE.findall(full)),
        "formMentions": len(FORM_RE.findall(full)),
        "roleMentions": len(ROLE_RE.findall(full)),
        "algorithmMentions": len(ALGO_RE.findall(full)),
        "charCount": len(full),
        "wordCount": len(full.split()),
        "pageCount": len(pages),
        "emptyPages": sum(1 for p in pages if (p["charCount"] or 0) < 20),
    }


def suggest_sections_for_file(
    subject_num: int,
    anchors: list[dict[str, Any]],
    hierarchy: dict[str, Any],
) -> list[dict[str, Any]]:
    scores: dict[str, int] = defaultdict(int)
    for sid in SUBJECT_SECTION_PRIOR.get(subject_num, []):
        scores[sid] += 2
    for a in anchors:
        for s in a["suggestedSituations"]:
            sec = s.get("sectionId")
            if sec:
                scores[sec] += 1 + min(3, a["hitCount"] // 3)
    # also from situation codes even if section missing
    out = []
    for sid, score in sorted(scores.items(), key=lambda x: -x[1]):
        title = hierarchy["sections"].get(sid, {}).get("title")
        out.append(
            {
                "sectionId": sid,
                "title": title,
                "score": score,
                "confidence": "high" if score >= 5 else "medium" if score >= 2 else "low",
            }
        )
    return out[:6]


def subject_folder_meta(folder: Path) -> dict[str, Any]:
    m = re.match(r"^(\d+)_(.+)$", folder.name)
    if not m:
        return {
            "num": None,
            "title": folder.name,
            "id": slugify(folder.name),
            "folderName": folder.name,
        }
    num = int(m.group(1))
    title = m.group(2)
    return {
        "num": num,
        "title": title,
        "id": f"{num:02d}_{slugify(title, 50)}",
        "folderName": folder.name,
    }


def build_file_entry(
    subject: dict[str, Any],
    path: Path,
    hierarchy: dict[str, Any],
) -> dict[str, Any]:
    rel = str(path.relative_to(LESSONS)).replace("\\", "/")
    clf = classify_file(path.name, rel)
    pages, meta = load_or_extract(subject["id"], path)
    signals = content_signals(pages)
    themes = detect_themes(pages) if pages and not meta.get("error") else []
    file_anchors = scan_anchors(pages, hierarchy) if pages else []

    # per-theme anchors (deeper)
    for th in themes:
        if th.get("num") == "?" and th.get("detection") == "fallback_whole_file":
            th["anchors"] = file_anchors
            continue
        th["anchors"] = scan_anchors(
            pages, hierarchy, th["startPage"], th["endPage"]
        )
        # soft situation suggestions unique
        sit_scores: dict[str, int] = defaultdict(int)
        sit_meta: dict[str, dict[str, Any]] = {}
        for a in th["anchors"]:
            for s in a["suggestedSituations"]:
                code = s["code"]
                sit_scores[code] += a["hitCount"]
                sit_meta[code] = s
        suggestions = []
        for code, sc in sorted(sit_scores.items(), key=lambda x: -x[1])[:8]:
            sm = sit_meta[code]
            suggestions.append(
                {
                    **sm,
                    "score": sc,
                    "confidence": sm["confidence"]
                    if sm.get("title")
                    else "low",
                }
            )
        th["suggestedSituations"] = suggestions
        th["needsReview"] = not suggestions or all(
            s.get("confidence") != "high" for s in suggestions
        )

    section_suggestions = suggest_sections_for_file(
        subject["num"] or 0, file_anchors, hierarchy
    )

    # Prefer filename theme for single-lecture files
    entry = {
        "path": rel,
        "fileName": path.name,
        "ext": path.suffix.lower(),
        "sizeBytes": path.stat().st_size,
        **clf,
        "extract": meta,
        "signals": signals,
        "themes": themes,
        "anchors": file_anchors,
        "suggestedSections": section_suggestions,
        "needsReview": clf["kind"] in {"lecture_candidate", "duplicate_suspect"}
        or bool(meta.get("error"))
        or signals["wordCount"] < 80,
    }
    return entry


def render_subject_md(subject: dict[str, Any], data: dict[str, Any]) -> str:
    lines: list[str] = []
    lines.append(f"# Карта предмета: {subject['num']}. {subject['title']}")
    lines.append("")
    lines.append(f"- **id:** `{subject['id']}`")
    lines.append(f"- **папка:** `Lessons/{subject['folderName']}`")
    lines.append(f"- **згенеровано:** {data['generatedAt']}")
    lines.append(f"- **файлів:** {data['stats']['files']}")
    lines.append(
        f"- **за видами:** {json.dumps(data['stats']['byKind'], ensure_ascii=False)}"
    )
    lines.append(
        f"- **слів (extract):** {data['stats']['totalWords']}; "
        f"помилок extract: {data['stats']['extractErrors']}"
    )
    lines.append("")
    lines.append("## Пріоритетні розділи 1-го контуру (мʼяко)")
    lines.append("")
    for s in data.get("suggestedSections", [])[:8]:
        conf = s.get("confidence", "?")
        title = s.get("title") or "—"
        lines.append(
            f"- `{s['sectionId']}` — {title} (score={s['score']}, {conf})"
        )
    lines.append("")
    lines.append("## Файли")
    lines.append("")
    for f in data["files"]:
        lines.append(f"### `{f['fileName']}`")
        lines.append("")
        lines.append(
            f"- вид: **{f['kind']}** ({f['kindConfidence']}); "
            f"ext={f['ext']}; size={f['sizeBytes'] // 1024} KB"
        )
        if f["extract"].get("error"):
            lines.append(f"- extract error: `{f['extract']['error']}`")
        else:
            sig = f["signals"]
            lines.append(
                f"- обсяг: {sig['wordCount']} слів / {sig['pageCount']} стор.; "
                f"порожніх≈{sig['emptyPages']}; "
                f"НПА≈{sig['npaMentions']}, бланки≈{sig['formMentions']}, "
                f"алгоритм≈{sig['algorithmMentions']}"
            )
        if f.get("suggestedSections"):
            top = ", ".join(
                f"`{s['sectionId']}`" for s in f["suggestedSections"][:3]
            )
            lines.append(f"- розділи: {top}")
        lines.append("")
        if f["themes"]:
            lines.append("| Тема | Стор. | Слів | Обсяг | Suggested (top) | Review |")
            lines.append("|---|---|---:|---|---|---|")
            for th in f["themes"]:
                sits = th.get("suggestedSituations") or []
                top = "; ".join(
                    f"{s['code']}" + (f" {s['title'][:40]}" if s.get("title") else "")
                    for s in sits[:3]
                ) or "—"
                lines.append(
                    f"| {th.get('label', '').replace('|', '/')} | "
                    f"{th.get('startPage')}–{th.get('endPage')} | "
                    f"{th.get('wordCount', '—')} | {th.get('volume', '—')} | "
                    f"{top.replace('|', '/')} | "
                    f"{'yes' if th.get('needsReview') else 'no'} |"
                )
            lines.append("")
        if f["anchors"]:
            lines.append("Якорі (файл):")
            for a in f["anchors"][:20]:
                codes = ", ".join(
                    s["code"] for s in a["suggestedSituations"][:4]
                )
                pages = ",".join(str(p) for p in a["hitPages"][:8])
                more = f"+{len(a['hitPages'])-8}" if len(a["hitPages"]) > 8 else ""
                lines.append(
                    f"- **{a['label']}** — стор. {pages}{more}; → {codes or '—'}"
                )
            lines.append("")
        if f.get("needsReview"):
            lines.append("_needs_review: так_")
            lines.append("")
    lines.append("## Примітки точності")
    lines.append("")
    lines.append(
        "- Без LLM: теми — з заголовків; suggested — словник якорей → HIERARCHY."
    )
    lines.append(
        "- `needs_review` / `confidence=low` — не брати в densify без перевірки."
    )
    lines.append(
        "- Тести/практики/НПА/дублікати зазвичай не є основним джерелом цитат UI."
    )
    lines.append("")
    return "\n".join(lines)


def render_master_md(master: dict[str, Any]) -> str:
    lines: list[str] = []
    lines.append("# Загальна карта лекцій (21 предмет)")
    lines.append("")
    lines.append(f"- згенеровано: {master['generatedAt']}")
    lines.append(f"- предметів: {master['stats']['subjects']}")
    lines.append(f"- файлів: {master['stats']['files']}")
    lines.append(f"- слів extract: {master['stats']['totalWords']}")
    lines.append("")
    lines.append("## Предмети")
    lines.append("")
    lines.append("| # | Предмет | Файлів | Слів | Підкарта | Топ розділи |")
    lines.append("|---:|---|---:|---:|---|---|")
    for s in master["subjects"]:
        tops = ", ".join(f"`{x['sectionId']}`" for x in s.get("suggestedSections", [])[:3])
        lines.append(
            f"| {s['num']} | {s['title']} | {s['fileCount']} | {s['wordCount']} | "
            f"[MAP](subjects/{s['id']}/MAP.md) | {tops} |"
        )
    lines.append("")
    lines.append("## Індекс якорів → предмети / файли")
    lines.append("")
    for aid, payload in sorted(master["anchorIndex"].items(), key=lambda x: x[0]):
        lines.append(f"### {payload['label']} (`{aid}`)")
        lines.append("")
        for hit in payload["hits"][:25]:
            lines.append(
                f"- [{hit['subjectNum']}] `{hit['fileName']}` "
                f"(hits={hit['hitCount']}) → {', '.join(hit['situationCodes'][:5])}"
            )
        if len(payload["hits"]) > 25:
            lines.append(f"- … +{len(payload['hits']) - 25}")
        lines.append("")
    lines.append("## Покриття HIERARCHY (мʼякі попадання)")
    lines.append("")
    lines.append("| Код | Назва | Хітів якорів | Предмети |")
    lines.append("|---|---|---:|---|")
    for code, row in sorted(
        master["hierarchyCoverage"].items(),
        key=lambda x: [int(p) for p in x[0].split(".")],
    ):
        subs = ", ".join(str(n) for n in sorted(row["subjects"])[:8])
        title = (row.get("title") or "—")[:60]
        lines.append(f"| {code} | {title} | {row['hits']} | {subs} |")
    lines.append("")
    lines.append(
        "Ситуації без хітів або з TBD (8–14) — кандидати на прогалини / ручний розбір."
    )
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    if not LESSONS.exists():
        raise SystemExit(f"Lessons not found: {LESSONS}")

    hierarchy = parse_hierarchy()
    MAPS.mkdir(parents=True, exist_ok=True)
    (MAPS / "subjects").mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)

    folders = sorted(
        [d for d in LESSONS.iterdir() if d.is_dir() and not d.name.startswith(".")],
        key=lambda d: (
            int(m.group(1))
            if (m := re.match(r"^(\d+)_", d.name))
            else 999,
            d.name,
        ),
    )

    generated_at = datetime.now(timezone.utc).isoformat()
    master_subjects: list[dict[str, Any]] = []
    anchor_index: dict[str, dict[str, Any]] = {}
    hierarchy_coverage: dict[str, dict[str, Any]] = {
        code: {
            "title": sit["title"],
            "hits": 0,
            "subjects": set(),
        }
        for code, sit in hierarchy["situations"].items()
    }
    # also allow TBD codes from anchors
    total_files = 0
    total_words = 0

    for folder in folders:
        subject = subject_folder_meta(folder)
        print(f"== {subject['id']} ==")
        files = sorted(
            [p for p in folder.rglob("*") if p.is_file()],
            key=lambda p: str(p).lower(),
        )
        entries: list[dict[str, Any]] = []
        by_kind: dict[str, int] = defaultdict(int)
        extract_errors = 0
        subj_words = 0
        section_scores: dict[str, int] = defaultdict(int)

        for path in files:
            print(f"  - {path.name[:80]}")
            entry = build_file_entry(subject, path, hierarchy)
            entries.append(entry)
            by_kind[entry["kind"]] += 1
            if entry["extract"].get("error"):
                extract_errors += 1
            subj_words += entry["signals"].get("wordCount", 0)
            for s in entry.get("suggestedSections", []):
                section_scores[s["sectionId"]] += s["score"]
            for a in entry.get("anchors", []):
                aid = a["id"]
                if aid not in anchor_index:
                    anchor_index[aid] = {"label": a["label"], "hits": []}
                codes = [s["code"] for s in a["suggestedSituations"]]
                anchor_index[aid]["hits"].append(
                    {
                        "subjectNum": subject["num"],
                        "subjectId": subject["id"],
                        "fileName": entry["fileName"],
                        "path": entry["path"],
                        "hitCount": a["hitCount"],
                        "situationCodes": codes,
                    }
                )
                for s in a["suggestedSituations"]:
                    code = s["code"]
                    if code not in hierarchy_coverage:
                        hierarchy_coverage[code] = {
                            "title": s.get("title"),
                            "hits": 0,
                            "subjects": set(),
                        }
                    hierarchy_coverage[code]["hits"] += a["hitCount"]
                    if subject["num"] is not None:
                        hierarchy_coverage[code]["subjects"].add(subject["num"])

        suggested_sections = []
        for sid, score in sorted(section_scores.items(), key=lambda x: -x[1])[:8]:
            suggested_sections.append(
                {
                    "sectionId": sid,
                    "title": hierarchy["sections"].get(sid, {}).get("title"),
                    "score": score,
                    "confidence": "high"
                    if score >= 20
                    else "medium"
                    if score >= 8
                    else "low",
                }
            )
        # ensure subject prior appears
        for sid in SUBJECT_SECTION_PRIOR.get(subject["num"] or 0, []):
            if not any(s["sectionId"] == sid for s in suggested_sections):
                suggested_sections.append(
                    {
                        "sectionId": sid,
                        "title": hierarchy["sections"].get(sid, {}).get("title"),
                        "score": 1,
                        "confidence": "medium",
                    }
                )

        data = {
            "generatedAt": generated_at,
            "schemaVersion": 1,
            "summarySource": "heuristic",
            "subject": subject,
            "stats": {
                "files": len(entries),
                "byKind": dict(by_kind),
                "totalWords": subj_words,
                "extractErrors": extract_errors,
            },
            "suggestedSections": suggested_sections,
            "files": entries,
        }

        out_dir = MAPS / "subjects" / subject["id"]
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "map.json").write_text(
            json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        (out_dir / "MAP.md").write_text(
            render_subject_md(subject, data), encoding="utf-8"
        )

        total_files += len(entries)
        total_words += subj_words
        master_subjects.append(
            {
                "num": subject["num"],
                "id": subject["id"],
                "title": subject["title"],
                "folderName": subject["folderName"],
                "fileCount": len(entries),
                "wordCount": subj_words,
                "byKind": dict(by_kind),
                "suggestedSections": suggested_sections,
                "mapPath": f"subjects/{subject['id']}/MAP.md",
            }
        )

    # serialize sets
    cov_out = {}
    for code, row in hierarchy_coverage.items():
        cov_out[code] = {
            "title": row.get("title"),
            "hits": row["hits"],
            "subjects": sorted(row["subjects"]),
        }

    master = {
        "generatedAt": generated_at,
        "schemaVersion": 1,
        "summarySource": "heuristic",
        "stats": {
            "subjects": len(master_subjects),
            "files": total_files,
            "totalWords": total_words,
        },
        "subjects": master_subjects,
        "anchorIndex": anchor_index,
        "hierarchyCoverage": cov_out,
        "notes": [
            "No LLM. Soft suggestions only.",
            "Text cache: maps/_extract_cache/",
            "Re-run: python build_lecture_maps.py",
        ],
    }
    (MAPS / "_master.json").write_text(
        json.dumps(master, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (MAPS / "_MASTER.md").write_text(render_master_md(master), encoding="utf-8")
    print("DONE", MAPS)
    print("subjects", len(master_subjects), "files", total_files, "words", total_words)


if __name__ == "__main__":
    main()
