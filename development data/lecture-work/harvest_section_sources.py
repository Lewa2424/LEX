# -*- coding: utf-8 -*-
"""
Harvest source candidates for one 1st-contour section from lecture maps.

Reads maps/_master.json + subjects/*/map.json.
Writes lecture-work/sections/<sectionId>/SOURCES.md + sources.json.

Does NOT write into UI mock.
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
MAPS = ROOT / "maps"
OUT_ROOT = ROOT / "sections"

# Section configs: hierarchy codes belonging to section + preferred anchors
SECTIONS: dict[str, dict[str, Any]] = {
    "01_preparation_admission": {
        "sectionId": "preparation_admission",
        "title": "Підготовка та допуск",
        "codes": [f"1.{i}" for i in range(1, 18)],
        "anchorIds": [
            "instruktazh",
            "medogliad",
            "elektro_grupa",
            "navchannia_op",
            "stazhuvannia",
            "nariad",
            "oboviazky_robotodavtsia",
            "oboviazky_pracivnyka",
        ],
        # Prefer operational lectures over tests/npa walls
        "kindScore": {
            "lecture": 100,
            "lecture_candidate": 70,
            "practice": 25,
            "npa_or_standard": 40,
            "test": 5,
            "duplicate": 0,
            "duplicate_suspect": 10,
        },
    }
}


def load_master() -> dict[str, Any]:
    return json.loads((MAPS / "_master.json").read_text(encoding="utf-8"))


def load_subject_maps() -> dict[str, dict[str, Any]]:
    out: dict[str, dict[str, Any]] = {}
    for p in (MAPS / "subjects").glob("*/map.json"):
        data = json.loads(p.read_text(encoding="utf-8"))
        out[data["subject"]["id"]] = data
    return out


def parse_hierarchy_titles() -> dict[str, str]:
    text = (ROOT / "HIERARCHY.md").read_text(encoding="utf-8")
    titles: dict[str, str] = {}
    for m in re.finditer(r"^\|\s*(\d+\.\d+)\s*\|\s*([^|]+)\|", text, re.M):
        titles[m.group(1)] = m.group(2).strip()
    return titles


def file_index(subject_maps: dict[str, dict[str, Any]]) -> dict[str, dict[str, Any]]:
    """path -> file entry + subject meta"""
    idx: dict[str, dict[str, Any]] = {}
    for sid, data in subject_maps.items():
        subj = data["subject"]
        for f in data["files"]:
            idx[f["path"]] = {**f, "subjectId": sid, "subjectNum": subj.get("num"), "subjectTitle": subj.get("title")}
    return idx


def harvest_section(cfg: dict[str, Any], master: dict[str, Any], files: dict[str, dict[str, Any]], titles: dict[str, str]) -> dict[str, Any]:
    kind_score = cfg["kindScore"]
    by_code: dict[str, list[dict[str, Any]]] = {c: [] for c in cfg["codes"]}

    # From hierarchyCoverage-linked anchors via master.anchorIndex
    for aid in cfg["anchorIds"]:
        payload = master.get("anchorIndex", {}).get(aid)
        if not payload:
            continue
        for hit in payload["hits"]:
            path = hit["path"]
            fmeta = files.get(path, {})
            kind = fmeta.get("kind", "lecture_candidate")
            score = kind_score.get(kind, 20) + min(40, hit["hitCount"])
            for code in hit.get("situationCodes", []):
                if code not in by_code:
                    continue
                by_code[code].append(
                    {
                        "path": path,
                        "fileName": hit["fileName"],
                        "subjectNum": hit["subjectNum"],
                        "subjectId": hit.get("subjectId"),
                        "subjectTitle": fmeta.get("subjectTitle"),
                        "kind": kind,
                        "hitCount": hit["hitCount"],
                        "anchorId": aid,
                        "anchorLabel": payload["label"],
                        "score": score,
                        "wordCount": (fmeta.get("signals") or {}).get("wordCount", 0),
                        "pages": (fmeta.get("signals") or {}).get("pageCount"),
                        "themes": [
                            {
                                "label": t.get("label"),
                                "startPage": t.get("startPage"),
                                "endPage": t.get("endPage"),
                                "volume": t.get("volume"),
                            }
                            for t in (fmeta.get("themes") or [])[:8]
                        ],
                    }
                )

    # Dedupe per code by path: keep best score, merge anchors
    for code, rows in by_code.items():
        merged: dict[str, dict[str, Any]] = {}
        for r in rows:
            key = r["path"]
            if key not in merged:
                merged[key] = {**r, "anchors": [r["anchorId"]]}
            else:
                m = merged[key]
                m["hitCount"] += r["hitCount"]
                m["score"] = max(m["score"], r["score"]) + min(10, r["hitCount"])
                if r["anchorId"] not in m["anchors"]:
                    m["anchors"].append(r["anchorId"])
        ranked = sorted(merged.values(), key=lambda x: (-x["score"], -x["hitCount"], x["fileName"]))
        # Drop pure noise unless nothing else
        preferred = [x for x in ranked if x["kind"] in {"lecture", "lecture_candidate", "npa_or_standard"}]
        by_code[code] = preferred if preferred else ranked

    situations = []
    for code in cfg["codes"]:
        rows = by_code[code]
        situations.append(
            {
                "code": code,
                "title": titles.get(code, ""),
                "candidateCount": len(rows),
                "primary": rows[:12],
                "secondary": rows[12:30],
                "questionHint": f"Що потрібно знати / зробити щодо: {titles.get(code, code)}?",
            }
        )

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sectionKey": None,
        "sectionId": cfg["sectionId"],
        "title": cfg["title"],
        "discipline": [
            "Кожна ситуація (2-й контур) = одна конкретна відповідь на робоче питання.",
            "Не звалювати простині НПА в один підрозділ; дробити на окремі ситуації/підрозділи.",
            "Пріоритет джерел: lecture > npa_or_standard > practice; test/duplicate — лише за потреби.",
            "Оформлення журналів/бланків — дубль у розділ Документація, тут — процес допуску.",
        ],
        "situations": situations,
    }


def render_md(data: dict[str, Any]) -> str:
    lines: list[str] = []
    lines.append(f"# Джерела для розділу: {data['title']}")
    lines.append("")
    lines.append(f"- згенеровано: {data['generatedAt']}")
    lines.append(f"- sectionId: `{data['sectionId']}`")
    lines.append("")
    lines.append("## Дисципліна")
    lines.append("")
    for d in data["discipline"]:
        lines.append(f"- {d}")
    lines.append("")
    lines.append("## Ситуації та кандидати")
    lines.append("")
    for sit in data["situations"]:
        lines.append(f"### {sit['code']} — {sit['title']}")
        lines.append("")
        lines.append(f"**Питання-орієнтир:** {sit['questionHint']}")
        lines.append("")
        lines.append(f"Кандидатів (після фільтра): **{sit['candidateCount']}**")
        lines.append("")
        if not sit["primary"]:
            lines.append("_Немає сильних lecture-кандидатів — потрібен ручний перегляд корпусу._")
            lines.append("")
            continue
        lines.append("| # | Файл | Предмет | kind | hits | score | теми (фрагмент) |")
        lines.append("|---:|---|---|---|---:|---:|---|")
        for i, r in enumerate(sit["primary"], 1):
            themes = "; ".join(
                (t.get("label") or "")[:60] for t in (r.get("themes") or [])[:2]
            ) or "—"
            lines.append(
                f"| {i} | `{r['fileName']}` | {r.get('subjectNum')} | {r['kind']} | "
                f"{r['hitCount']} | {r['score']} | {themes.replace('|', '/')} |"
            )
        lines.append("")
        if sit["secondary"]:
            lines.append(
                f"_Ще {len(sit['secondary'])} вторинних файлів — див. `sources.json`._"
            )
            lines.append("")
    lines.append("## Наступний крок")
    lines.append("")
    lines.append(
        "1. Затвердити / дробити ситуації під конкретні питання читача.\n"
        "2. Синхронізувати mock.\n"
        "3. Densify по одній ситуації з primary-файлів (Q&A, без простинь)."
    )
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    if not (MAPS / "_master.json").exists():
        raise SystemExit("maps/_master.json missing — run build_lecture_maps.py first")

    master = load_master()
    subject_maps = load_subject_maps()
    files = file_index(subject_maps)
    titles = parse_hierarchy_titles()

    for key, cfg in SECTIONS.items():
        data = harvest_section(cfg, master, files, titles)
        data["sectionKey"] = key
        out_dir = OUT_ROOT / key
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "sources.json").write_text(
            json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        (out_dir / "SOURCES.md").write_text(render_md(data), encoding="utf-8")
        print("wrote", out_dir)


if __name__ == "__main__":
    main()
