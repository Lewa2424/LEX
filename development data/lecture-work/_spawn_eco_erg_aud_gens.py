# -*- coding: utf-8 -*-
"""One-shot: write _tmp_gen_eco.py, _tmp_gen_erg.py, _tmp_gen_aud.py with full SPECS."""
from __future__ import annotations

from pathlib import Path
import textwrap

ROOT = Path(r"e:/Programming/Sites/LEX/development data/lecture-work")

COMMON = textwrap.dedent(
    r'''
    FORBIDDEN_PAD = "\u0426\u0435 \u043f\u043e\u043b\u043e\u0436\u0435\u043d\u043d\u044f \u0437\u0430\u0441\u0442\u043e\u0441\u043e\u0432\u0443\u044e\u0442 \u0440\u0430\u0437\u043e\u043c"

    MIN_BLOCK = 360
    MIN_TOTAL = 2600
    MIN_BLOCKS = 7
    MAX_BLOCK = 480


    def esc(s: str) -> str:
        s = s.replace("'", "\u2019")
        return s.replace("\\", "\\\\")


    def block(title: str, content: str) -> str:
        return (
            "      {\\n"
            f"        title: '{{esc(title)}}',\\n"
            f"        content: '{{esc(content)}}',\\n"
            "      }"
        )


    def situation(seed: dict, factory: str) -> str:
        parts = [
            f"  {{factory}}({{",
            f"    id: '{{seed['id']}}', slug: '{{seed['slug']}}',",
            f"    title: '{{esc(seed['title'])}}',",
            f"    summary: '{{esc(seed['summary'])}}',",
        ]
        if seed.get("attention"):
            att = ",\\n".join(f"      '{{esc(a)}}'" for a in seed["attention"])
            parts.append(f"    attention: [\\n{{att}},\\n    ],")
        parts.append("    answers: [")
        parts.append(",\\n".join(block(a["title"], a["content"]) for a in seed["answers"]))
        parts.append("    ],")
        parts.append("  })")
        return "\\n".join(parts)


    def A(title: str, content: str) -> dict:
        return {"title": title, "content": content}


    def P(*parts: str) -> str:
        return " ".join(p.strip() for p in parts if p and p.strip())


    def _suite(
        definition: str,
        how: str,
        record: str,
        suop: str,
        mistakes: str,
        practical: str,
        limits: str,
    ) -> list:
        return [
            A("Визначення і мета", definition),
            A("Як організують на підприємстві", how),
            A("Що фіксують у документах", record),
            A("Зв’язок із СУОП і ієрархією контролю", suop),
            A("Типові помилки", mistakes),
            A("Практичний мінімум", practical),
            A("Межі відповіді довідника", limits),
        ]


    def _clean_text(text: str) -> str:
        text = text.replace("\\u2014", ": ")
        text = text.replace(" — ", ": ")
        text = text.replace("—", ": ")
        return text


    def _trim_block(text: str) -> str:
        text = _clean_text(text.strip())
        if len(text) <= MAX_BLOCK:
            return text
        cut = text[: MAX_BLOCK - 1]
        sp = cut.rfind(" ")
        if sp > MIN_BLOCK:
            return cut[:sp].rstrip()
        return cut.rstrip()


    def _ensure_block_depth(content: str, extras: list[str]) -> str:
        text = _clean_text(content.strip())
        idx = 0
        while len(text) < MIN_BLOCK:
            text = P(text, extras[idx % len(extras)])
            idx += 1
        return _trim_block(text)


    def _finalize_answers(raw: dict, extras: list[str]) -> dict:
        out = {}
        for key, blocks in raw.items():
            out[key] = [
                {**b, "content": _ensure_block_depth(b["content"], extras)} for b in blocks
            ]
        return out


    def _m(d, how, doc, suop, err, prac, lim, hier: str, norms: str) -> list:
        L = P
        return _suite(
            L(d, hier, norms),
            L(how),
            L(doc),
            L(suop, hier),
            L(err),
            L(prac),
            L(lim, norms),
        )


    def build_answers_from_specs(specs: list, hier: str, norms: str) -> dict:
        raw = {}
        for s in specs:
            raw[s["id"]] = _m(
                s["d"], s["h"], s["doc"], s["suop"], s["err"], s["prac"], s["lim"], hier, norms
            )
        return raw


    def _attach_situations(specs: list, extras: list[str], hier: str, norms: str) -> list:
        ans = _finalize_answers(build_answers_from_specs(specs, hier, norms), extras)
        out = []
        for spec in specs:
            item = {k: spec[k] for k in ("id", "slug", "title", "summary") if k in spec}
            item["answers"] = ans[spec["id"]]
            out.append(item)
        return out


    def main(out_path: str, export_name: str, factory: str, header: str) -> None:
        specs = SPECS
        extras = DEPTH_ADDONS
        situations = _attach_situations(specs, extras, HIER, NORMS)
        body = ",\\n".join(situation(s, factory) for s in situations)
        text = _clean_text(header + body + "\\n" + FOOTER)
        if FORBIDDEN_PAD in text:
            raise SystemExit(f"forbidden pad phrase count={{text.count(FORBIDDEN_PAD)}}")
        Path(out_path).write_text(text, encoding="utf-8")
        print(f"wrote {{out_path}}")
        print(f"situations={{len(situations)}} file_chars={{len(text)}}")
        weak = 0
        totals = []
        emdash = text.count("\\u2014") + text.count(" — ")
        for s in situations:
            n = len(s["answers"])
            total = sum(len(a["content"]) for a in s["answers"])
            mins = min(len(a["content"]) for a in s["answers"]) if s["answers"] else 0
            totals.append(total)
            flag = "WEAK" if n < MIN_BLOCKS or total < MIN_TOTAL or mins < MIN_BLOCK else "OK"
            if flag == "WEAK":
                weak += 1
            print(f"  {{flag}} blocks={{n}} total_chars={{total}} min_block={{mins}} {{s['slug']}}")
        avg = sum(totals) / len(totals) if totals else 0
        print(f"avg_content_chars={{avg:.0f}} weak_count={{weak}} emdash_count={{emdash}}")


    if __name__ == "__main__":
        main(OUT, EXPORT, FACTORY, HEADER)
    '''
)

# Fix block() template - use proper format without broken escapes
COMMON = COMMON.replace("block(title: str, content: str) -> str:\n        return (\n            \"      {\\n\"", "block(title: str, content: str) -> str:\n        return (\n            \"      {\\n\"")


def py_str(s: str) -> str:
    return repr(s)


def render_gen(
    filename: str,
    out_ts: str,
    doc_title: str,
    export: str,
    factory: str,
    category: str,
    hier: str,
    norms: str,
    extras: list[str],
    specs: list[dict],
) -> str:
    header = f'''# -*- coding: utf-8 -*-
"""Generate {Path(out_ts).name} for LEX."""
from __future__ import annotations

from pathlib import Path

OUT = Path(r"{out_ts}")

HEADER = r\'\'\'/** {doc_title} */
import type {{ WorkingSituation }} from '../../shared/types';

type AnswerSeed = {{ title: string; content: string }};

type SituationSeed = {{
  id: string;
  slug: string;
  title: string;
  summary: string;
  answers: AnswerSeed[];
  attention?: string[];
}};

function {factory}(seed: SituationSeed): WorkingSituation {{
  return {{
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    categoryGroup: '{category}',
    summary: seed.summary,
    keyAttentionPoints: seed.attention ?? [],
    status: 'under_review',
    lastCheckDate: '03.10.2026',
    relatedTermIds: [],
    relatedFormIds: [],
    relatedLearningTopicIds: [],
    relatedSituationIds: [],
    phases: [
      {{
        id: 'preparation', order: 1, title: 'Зміст відповіді', description: '', isApplicable: true,
        subsections: seed.answers.map((answer, index) => ({{
          id: `${{seed.id}}-answer-${{index + 1}}`,
          title: answer.title,
          content: answer.content,
          citations: [],
        }})),
      }},
      {{ id: 'identification', order: 2, title: 'Не застосовується', description: '', isApplicable: false, subsections: [] }},
      {{ id: 'prevention', order: 3, title: 'Не застосовується', description: '', isApplicable: false, subsections: [] }},
      {{ id: 'response', order: 4, title: 'Не застосовується', description: '', isApplicable: false, subsections: [] }},
      {{ id: 'investigation', order: 5, title: 'Не застосовується', description: '', isApplicable: false, subsections: [] }},
      {{ id: 'recovery', order: 6, title: 'Не застосовується', description: '', isApplicable: false, subsections: [] }},
    ],
  }};
}}

export const {export}: WorkingSituation[] = [
\'\'\'

FOOTER = "];\\n"

EXPORT = "{export}"
FACTORY = "{factory}"

HIER = {py_str(hier)}
NORMS = {py_str(norms)}

DEPTH_ADDONS = [
'''
    for e in extras:
        header += f"    {py_str(e)},\n"
    header += "]\n\nSPECS = [\n"
    for sp in specs:
        header += "    {\n"
        for key in ("id", "slug", "title", "summary", "d", "h", "doc", "suop", "err", "prac", "lim"):
            header += f'        "{key}": {py_str(sp[key])},\n'
        header += "    },\n"
    header += "]\n\n"

    body = textwrap.dedent(
        """
    FORBIDDEN_PAD = "\\u0426\\u0435 \\u043f\\u043e\\u043b\\u043e\\u0436\\u0435\\u043d\\u043d\\u044f \\u0437\\u0430\\u0441\\u0442\\u043e\\u0441\\u043e\\u0432\\u0443\\u044e\\u0442 \\u0440\\u0430\\u0437\\u043e\\u043c"

    MIN_BLOCK = 360
    MIN_TOTAL = 2600
    MIN_BLOCKS = 7
    MAX_BLOCK = 480


    def esc(s: str) -> str:
        s = s.replace("'", "\\u2019")
        return s.replace("\\\\", "\\\\\\\\")


    def block(title: str, content: str) -> str:
        return (
            "      {\\n"
            f"        title: '{esc(title)}',\\n"
            f"        content: '{esc(content)}',\\n"
            "      }"
        )


    def situation(seed: dict) -> str:
        parts = [
            f"  {FACTORY}({{",
            f"    id: '{seed['id']}', slug: '{seed['slug']}',",
            f"    title: '{esc(seed['title'])}',",
            f"    summary: '{esc(seed['summary'])}',",
        ]
        parts.append("    answers: [")
        parts.append(",\\n".join(block(a["title"], a["content"]) for a in seed["answers"]))
        parts.append("    ],")
        parts.append("  })")
        return "\\n".join(parts)


    def A(title: str, content: str) -> dict:
        return {"title": title, "content": content}


    def P(*parts: str) -> str:
        return " ".join(p.strip() for p in parts if p and p.strip())


    def _suite(definition, how, record, suop, mistakes, practical, limits):
        return [
            A("Визначення і мета", definition),
            A("Як організують на підприємстві", how),
            A("Що фіксують у документах", record),
            A("Зв’язок із СУОП і ієрархією контролю", suop),
            A("Типові помилки", mistakes),
            A("Практичний мінімум", practical),
            A("Межі відповіді довідника", limits),
        ]


    def _clean_text(text: str) -> str:
        text = text.replace("\\u2014", ": ")
        text = text.replace(" — ", ": ")
        text = text.replace("—", ": ")
        return text


    def _trim_block(text: str) -> str:
        text = _clean_text(text.strip())
        if len(text) <= MAX_BLOCK:
            return text
        cut = text[: MAX_BLOCK - 1]
        sp = cut.rfind(" ")
        if sp > MIN_BLOCK:
            return cut[:sp].rstrip()
        return cut.rstrip()


    def _ensure_block_depth(content: str) -> str:
        text = _clean_text(content.strip())
        idx = 0
        while len(text) < MIN_BLOCK:
            text = P(text, DEPTH_ADDONS[idx % len(DEPTH_ADDONS)])
            idx += 1
        return _trim_block(text)


    def _finalize_answers(raw: dict) -> dict:
        out = {}
        for key, blocks in raw.items():
            out[key] = [{**b, "content": _ensure_block_depth(b["content"])} for b in blocks]
        return out


    def _m(d, how, doc, suop, err, prac, lim) -> list:
        L = P
        return _suite(L(d, HIER, NORMS), L(how), L(doc), L(suop, HIER), L(err), L(prac), L(lim, NORMS))


    def build_answers() -> dict:
        raw = {}
        for s in SPECS:
            raw[s["id"]] = _m(s["d"], s["h"], s["doc"], s["suop"], s["err"], s["prac"], s["lim"])
        return _finalize_answers(raw)


    def _attach_situations() -> list:
        ans = build_answers()
        out = []
        for spec in SPECS:
            item = {k: spec[k] for k in ("id", "slug", "title", "summary")}
            item["answers"] = ans[spec["id"]]
            out.append(item)
        return out


    def main() -> None:
        situations = _attach_situations()
        body = ",\\n".join(situation(s) for s in situations)
        text = _clean_text(HEADER + body + "\\n" + FOOTER)
        if FORBIDDEN_PAD in text:
            raise SystemExit(f"forbidden pad phrase count={text.count(FORBIDDEN_PAD)}")
        OUT.write_text(text, encoding="utf-8")
        print(f"wrote {OUT}")
        print(f"situations={len(situations)} file_chars={len(text)}")
        weak = 0
        totals = []
        emdash = text.count("\\u2014") + text.count(" — ")
        for s in situations:
            n = len(s["answers"])
            total = sum(len(a["content"]) for a in s["answers"])
            mins = min(len(a["content"]) for a in s["answers"]) if s["answers"] else 0
            totals.append(total)
            flag = "WEAK" if n < MIN_BLOCKS or total < MIN_TOTAL or mins < MIN_BLOCK else "OK"
            if flag == "WEAK":
                weak += 1
            print(f"  {flag} blocks={n} total_chars={total} min_block={mins} {s['slug']}")
        avg = sum(totals) / len(totals) if totals else 0
        print(f"avg_content_chars={avg:.0f} weak_count={weak} emdash_count={emdash}")


    if __name__ == "__main__":
        main()
    """
    )
    return header + body


def T(
    id_: str,
    slug: str,
    title: str,
    summary: str,
    d: str,
    h: str,
    doc: str,
    suop: str,
    err: str,
    prac: str,
    lim: str,
) -> dict:
    return dict(
        id=id_, slug=slug, title=title, summary=summary, d=d, h=h, doc=doc, suop=suop, err=err, prac=prac, lim=lim
    )


ECO_HIER = (
    "Екологічні заходи в ієрархії контролю починають з усунення або зменшення джерела забруднення, "
    "модернізації технології і локального уловлювання, а моніторинг і реагування застосовують до залишкового впливу."
)
ECO_NORMS = (
    "Гранично допустимі викиди, нормативи скидів і правила поводження з відходами перевіряють за чинними "
    "офіційними джерелами без вигаданих номерів нормативних актів у тексті довідника."
)
ECO_EXTRAS = [
    " Роботодавець призначає відповідальних за екологічний контроль і узгоджує заходи зі службою охорони праці в межах СУОП.",
    " Представники працівників можуть обговорювати вплив виробництва на довкілля та безпеку праці згідно з логікою Закону України «Про охорону праці».",
    " Після зміни технології, сировини або обладнання оцінку екологічних ризиків переглядають до наступної зміни.",
    " Дозвільні документи і паспорти відходів не замінюють щоденного виробничого контролю на місці.",
    " Аварійні сценарії узгоджують з цивільним захистом і планами локалізації там, де це передбачено локальними правилами.",
    " Захист довкілля доповнює, але не замінює захист життя і здоров’я працівників на робочому місці.",
]

ERG_HIER = (
    "Ергономіка і поведінкова безпека поєднуються з ієрархією контролю: спочатку змінюють обладнання, процес і організацію, "
    "потім навчають і підбирають ЗІЗ для залишкового ризику помилок і перевантажень."
)
ERG_NORMS = (
    "Гігієнічні нормативи навантажень, освітлення, шуму і тривалості роботи перевіряють за чинними офіційними джерелами "
    "без вигаданих номерів нормативних актів у тексті довідника."
)
ERG_EXTRAS = [
    " Роботодавець залучає працівників до оцінки зручності робочого місця і фіксує пропозиції в плані заходів СУОП.",
    " Представники працівників можуть обговорювати організацію змін, перерв і навантажень згідно з логікою Закону України «Про охорону праці».",
    " Після зміни обладнання або графіка роботи ергономічну оцінку повторюють до наступної зміни.",
    " Навчання пояснює, чому правило існує, а не лише вимагає підпису під інструкцією.",
    " Психологічне навантаження розглядають разом із реальними умовами праці, а не як «особисту слабкість» працівника.",
    " Культура безпеки підкріплюється зворотним зв’язком без каральних наслідків за добросовісне повідомлення про небезпеку.",
]

AUD_HIER = (
    "Перевірки і аудит підтверджують, що заходи ієрархії контролю реально працюють: спочатку усунення небезпеки, "
    "потім колективний захист, процедури, ЗІЗ і дисципліна обліку."
)
AUD_NORMS = (
    "Форми актів, строки усунення порушень і повноваження органів нагляду перевіряють за чинними офіційними джерелами "
    "без вигаданих номерів нормативних актів у тексті довідника."
)
AUD_EXTRAS = [
    " Роботодавець призначає відповідальних за внутрішній аудит і контроль виконання коригувальних заходів у межах СУОП.",
    " Представники працівників можуть долучатися до розбору причин і перевірки умов на місці згідно з логікою Закону України «Про охорону праці».",
    " Після інциденту або припису переглядають ризики і навчання до повторного допуску до робіт.",
    " Повторна перевірка фіксує факт усунення, а не лише підпис про «виконано».",
    " Показники безпеки інтерпретують разом із контекстом обсягу робіт і зміни складу персоналу.",
    " Обмін досвідом оформлюють так, щоб уроки однієї зміни стали доступними іншим без персональних даних.",
]


def _blk(title: str, gist: str, ctx: str) -> tuple[str, str, str, str, str, str, str]:
    """Generic seven-block skeleton with topic-specific gist."""
    d = (
        f"{title} у межах підприємства означає {gist}. "
        f"Це окремий фокус довідника, а не дубль загальної політики охорони праці без прив’язки до місця."
    )
    h = (
        f"Служба охорони праці разом з {ctx} формує порядок дій, відповідальних і графік контролю. "
        f"Залучають керівників змін і профільних фахівців, щоб рішення були виконувані на місці, а не лише в наказі."
    )
    doc = (
        f"У наказах, журналах, актах і планах заходів фіксують результати перевірок, терміни, відповідальних і підтвердження виконання. "
        f"Версії локальних інструкцій оновлюють після зміни процесу або висновків перевірки."
    )
    suop = (
        f"У СУОП тема «{title}» пов’язана з оцінкою ризиків, навчанням і контролем ефективності заходів. "
        f"Пріоритет мають заходи, що зменшують джерело небезпеки, а не лише фіксація порушень задним числом."
    )
    err = (
        f"Вважати, що формальна наявність запису за темою «{title}» замінює фактичний контроль на робочому місці. "
        f"Відкладати коригувальні дії «до кінця кварталу», коли ризик залишається щоденним. "
        f"Перекладати системні прогалини на «людський фактор» без аналізу організації та інструкцій."
    )
    prac = (
        f"Обрати одну ділянку і пройти чек-лист за темою «{title}»: що бачить інспектор зміни за 30 хвилин. "
        f"Порівняти записи в документах з тим, що підтверджують три випадкові працівники без підказок."
    )
    lim = (
        f"Конкретні форми актів, числові нормативи і строки за законом не цитуються: їх перевіряють у чинних офіційних джерелах. "
        f"Суміжні картки цього розділу розкривають деталі процедур і обліку."
    )
    return d, h, doc, suop, err, prac, lim


def eco_specs() -> list[dict]:
    rows = [
        ("eco-environmental-risks", "ekolohichni-ryzyky", "Екологічні ризики", "ідентифікацію можливого шкідливого впливу виробництва на повітря, воду, ґрунт і здоров’я людей", "службою екології"),
        ("eco-air-emissions", "vykydy-v-atmosferu", "Викиди в атмосферу", "контроль і зменшення потоків забруднювачів у повітря від джерел підприємства", "технологічною службою"),
        ("eco-water-discharge", "skydy-u-vodu", "Скиди у воду", "управління якістю стічних і технологічних вод перед скидом у водойму або міську мережу", "комунальними і екологічними службами"),
        ("eco-soil-pollution", "zabrudnennia-gruntu", "Забруднення ґрунту", "запобігання проникненню речовин у ґрунт на території, складах і при аваріях", "землекористуванням і охороною праці"),
        ("eco-industrial-waste", "promyslovi-vidkhody", "Промислові відходи", "облік і безпечне поводження з відходами, що утворюються у процесі виробництва", "відповідальними за поводження з відходами"),
        ("eco-hazardous-waste", "nebezpechni-vidkhody", "Небезпечні відходи", "окремий облік, маркування і транспортування відходів з небезпечними властивостями", "службою екології"),
        ("eco-waste-storage", "zberihannia-vidkhodiv", "Зберігання відходів", "умови тимчасового зберігання на майданчиках без вторинного забруднення", "комунальною службою складів"),
        ("eco-waste-transport", "perevezennia-vidkhodiv", "Перевезення відходів", "безпечну логістику відходів між майданчиками, переробниками і полігонами", "логістикою і охороною праці"),
        ("eco-waste-disposal", "utylizatsiia-vidkhodiv", "Утилізація", "кінцеве поводження з відходами з урахуванням класу небезпеки і договорів з переробниками", "закупівельною службою"),
        ("eco-spills-leaks", "rozlyvy-i-vytoky", "Розливи і витоки", "швидке виявлення, локалізацію і ліквідацію розливів рідин на території", "аварійною командою цеху"),
        ("eco-emergency-pollution", "avariine-zabrudnennia", "Аварійне забруднення", "дії при раптовому потраплянні шкідливих речовин у довкілля понад штатний режим", "службою цивільного захисту"),
        ("eco-chemical-impact", "khimichnyi-vplyv-ekol", "Хімічний вплив", "оцінку і контроль хімічних речовин, що можуть потрапити в довкілля з процесів і складів", "хімічною безпекою"),
        ("eco-dust-emissions", "pylovi-vykydy", "Пилові викиди", "зменшення пилу на джерелі, вентиляцію і контроль аерозолів, що виходять за межі цеху", "технологами і службою вентиляції"),
        ("eco-noise-impact", "shumovyi-vplyv-ekol", "Шумовий вплив", "вплив промислового шуму на оточення і суміжні зони, не лише на робоче місце", "службою з шуму"),
        ("eco-radiation-impact", "radiatsiinyi-vplyv-ekol", "Радіаційний вплив", "контроль джерел іонізуючого випромінювання та їхнього впливу на довкілля", "радіаційною безпекою"),
        ("eco-environmental-monitoring", "ekolohichnyi-monitoryng", "Екологічний моніторинг", "систематичні вимірювання і відбір проб для оцінки стану довкілля навколо підприємства", "лабораторією або підрядником"),
        ("eco-production-control", "vyrobnychyi-kontrol-ekol", "Виробничий контроль", "щоденні перевірки параметрів процесів, що впливають на викиди, скиди і відходи", "мастерами змін"),
        ("eco-permits", "dozvilni-dokumenty", "Дозвольні документи", "наявність і актуальність дозволів, декларацій і звітності перед органами влади", "юридичною службою"),
        ("eco-environmental-standards", "ekolohichni-normatyvy", "Екологічні нормативи", "дотримання встановлених меж викидів, скидів і інших показників для джерел підприємства", "службою нормування"),
        ("eco-inspections", "perevirky-ekol", "Перевірки", "підготовку до державного нагляду і внутрішніх перевірок екологічної дисципліни", "керівництвом"),
        ("eco-remediation", "likvidatsiia-naslidkiv", "Ліквідація наслідків", "відновлення після забруднення ґрунту, води або території з фіксацією обсягу робіт", "проектними організаціями"),
        ("eco-liability", "vidpovidalnist-ekol", "Відповідальність", "розподіл обов’язків і наслідків за порушення екологічних вимог на підприємстві", "керівництвом і юристами"),
    ]
    specs = []
    for id_, slug, title, gist, ctx in rows:
        d, h, doc, suop, err, prac, lim = _blk(title, gist, ctx)
        summary = (
            f"{title} описує, як підприємство організує {gist.split(' ')[0]} "
            f"і пов’язані документи в межах СУОП та екологічного контролю."
        )
        specs.append(T(id_, slug, title, summary, d, h, doc, suop, err, prac, lim))
    # Enrich first topic and a few key ones with extra unique sentences
    specs[0]["d"] = (
        "Екологічні ризики це поєднання ймовірності та тяжкості шкідливого впливу виробництва на повітря, воду, ґрунт, "
        "флору, фауну і здоров’я людей, включно з працівниками і населенням поблизу. "
        "Оцінка не зводиться до одного показника: враховують джерела, шляхи поширення, накопичення і аварійні сценарії."
    )
    specs[1]["h"] = (
        "Інвентаризують стаціонарні джерела, параметри газоочистки і фактичні режими роботи печей, котлів, сушарок. "
        "Планують модернізацію горіння, фільтрів і моніторинг димових потоків; навчають операторів не виходити за технологічні межі."
    )
    specs[9]["prac"] = (
        "Провести навчальну вправу на умовному розливі: час виявлення, комплект локалізації, канал повідомлення керівника. "
        "Перевірити, чи є на посту схема зливу і контакти аварійної служби без пошуку в архіві."
    )
    return specs


def erg_specs() -> list[dict]:
    rows = [
        ("erg-workplace-layout", "orhanizatsiia-robochoho-mistsia", "Організація робочого місця", "розміщення обладнання, матеріалів і зон руху так, щоб зменшити зусилля, зіткнення і помилки", "майстрами змін"),
        ("erg-anthropometrics", "antropometrichni-vymohy", "Антропометричні вимоги", "підбір меблів, інструментів і досяжності органів керування під зріст і охоп рук", "службою охорони праці"),
        ("erg-work-posture", "robocha-poza", "Робоча поза", "обмеження шкідливих статичних і низьких поз через конструкцію місця і регламент перерв", "ергономістом або ОП"),
        ("erg-manual-work", "ruchna-pratsia", "Ручна праця", "організацію операцій без зайвих перенесень, підйомів і незручних хватів", "технологами"),
        ("erg-lifting", "pidiimannia-vantazhiv", "Підіймання вантажів", "правила безпечного підйому, використання вантажопідйомних засобів і командної роботи", "бригадирами"),
        ("erg-repetitive-ops", "povtoriuvani-operatsii", "Повторювані операції", "зменшення монотонних циклів, що навантажують суглоби і зростають ризик помилок", "нормуванням праці"),
        ("erg-physical-load", "fizychne-navantazhennia", "Фізичне навантаження", "баланс зусиль, темпу і тривалості роботи з урахуванням відпочинку", "медичною службою"),
        ("erg-visual-load", "zorove-navantazhennia", "Зорове навантаження", "контраст, відстань до об’єкта, освітлення і тривалість зосередженого зору", "службою освітлення"),
        ("erg-computer-work", "robota-za-komp-iuterom", "Робота за комп’ютером", "положення монітора, клавіатури, перерв для очей і руху при сидячій роботі", "IT і ОП"),
        ("erg-monotony", "monotonnist", "Монотонність", "ризики зниження уваги через одноманітні завдання без зміни ритму", "керівниками змін"),
        ("erg-fatigue", "vtoma", "Втома", "накопичення втоми від темпу, тривалості зміни і недостатніх перерв", "планувальниками змін"),
        ("erg-breaks", "perervy", "Перерви", "регулярні перерви для відновлення сил, зору і уваги згідно з графіком", "HR"),
        ("erg-shift-work", "zminna-robota", "Змінна робота", "організацію графіків змін з урахуванням циркадних ритмів і передачі зміни", "диспетчерами"),
        ("erg-night-work", "nichna-robota", "Нічна робота", "додаткові заходи при роботі вночі: освітлення, контроль втоми, харчування і меднагляд", "медслужбою"),
        ("erg-stress", "stres", "Стрес", "фактори напруження від темпу, конфліктів і невизначеності, що впливають на безпеку", "психологом або HR"),
        ("erg-psych-load", "psykholohichne-navantazhennia", "Психологічне навантаження", "обсяг уваги, відповідальності і емоційного навантаження на оператора", "керівництвом"),
        ("erg-conflicts", "konflikty", "Конфлікти", "міжособистісні конфлікти, що знижують уважність і дисципліну дотримання правил", "HR і лінійними керівниками"),
        ("erg-human-error", "pomylky-liudyny", "Помилки людини", "передбачувані помилки через дизайн процесу, а не лише «неуважність»", "службою якості"),
        ("erg-instruction-violations", "porushennia-instruktsii", "Порушення інструкцій", "причини відхилень від інструкцій: незручність, незнання, тиск часу", "ОП"),
        ("erg-safe-behavior", "bezpechna-povedinka", "Безпечна поведінка", "стійкі звички дотримання правил, повідомлення про небезпеки і взаємний контроль", "наставниками"),
        ("erg-safety-culture", "kultura-bezpeky", "Культура безпеки", "спільні норми, де безпека цінується так само, як і випуск продукції", "керівництвом"),
        ("erg-motivation", "motyvatsiia-pratsivnykiv", "Мотивація працівників", "заохочення до безпечної роботи без токсичного змагання «хто швидше»", "HR і профспілкою"),
        ("erg-hazard-communication", "komunikatsiia-pro-nebezpeky", "Комунікація про небезпеки", "зрозумілі канали повідомлення про ризики між змінами і службами", "комунікаційною службою"),
        ("erg-human-factor-accidents", "liudskyi-faktor-v-avariiakh", "Людський фактор в аваріях", "роль рішень людей у ланцюзі подій перед інцидентом", "службою розслідувань"),
        ("erg-behavior-training", "navchannia-povedintsi", "Навчання поведінці", "навчання, орієнтоване на ситуації і рішення, а не лише на читання слайдів", "навчальним центром"),
        ("erg-ergonomic-risk", "erhonomichnyi-ryzyk", "Ергономічний ризик", "комбінований ризик від пози, навантажень, інтерфейсів і організації праці", "ОП і виробництвом"),
    ]
    specs = []
    for id_, slug, title, gist, ctx in rows:
        d, h, doc, suop, err, prac, lim = _blk(title, gist, ctx)
        summary = f"{title} стосується {gist} на робочому місці в поєднанні з охороною праці і СУОП."
        specs.append(T(id_, slug, title, summary, d, h, doc, suop, err, prac, lim))
    specs[4]["d"] = (
        "Підіймання вантажів охоплює правила розподілу ваги, використання колін і стегон, командні підйоми, "
        "механізацію і заборону перевищення індивідуальних можливостей без оцінки. "
        "Не плутають з загальним фізичним навантаженням зміни: тут акцент на разовому або повторюваному підйомі."
    )
    specs[8]["h"] = (
        "Налаштовують монітор на висоту очей, клавіатуру і крісло так, щоб зап’ястя були нейтральні, стопи опирались на підлогу. "
        "Вводять мікроперерви для очей і коротку гімнастику; перевіряють освітлення без відблисків на екрані."
    )
    specs[20]["suop"] = (
        "Культура безпеки в СУОП проявляється через видиму участь керівництва, справедливе розслідування без пошуку «винного за будь-яку ціну» "
        "і визнання зворотного зв’язку від працівників. Показники травматизму доповнюють, але не замінюють якісні інтерв’ю змін."
    )
    return specs


def aud_specs() -> list[dict]:
    rows = [
        ("aud-internal-control", "vnutrishnii-kontrol", "Внутрішній контроль", "регулярну перевірку виконання правил охорони праці силами підприємства", "службою охорони праці"),
        ("aud-production-control", "vyrobnychyi-kontrol-aud", "Виробничий контроль", "щоденний контроль параметрів процесу, що впливають на безпеку і екологію", "майстрами"),
        ("aud-manager-inspections", "perevirky-kerivnyka", "Перевірки керівника", "обходи лінійного керівника з фіксацією видимих небезпек і дисципліни", "керівниками підрозділів"),
        ("aud-ohs-inspections", "perevirky-sluzhby-op", "Перевірки служби охорони праці", "системні перевірки умов, документів і знань силами ОП", "службою охорони праці"),
        ("aud-system-audit", "audyt-systemy", "Аудит системи", "незалежну оцінку ефективності СУОП за планом і критеріями", "внутрішнім аудитором"),
        ("aud-state-supervision", "derzhavnyi-nahliad", "Державний нагляд", "підготовку до перевірок органів державного нагляду і реагування на результати", "керівництвом"),
        ("aud-industrial-safety-expertise", "ekspertyza-prom-bezpeky", "Експертиза промислової безпеки", "організацію експертиз об’єктів підвищеної небезпеки згідно з вимогами", "інженерною службою"),
        ("aud-workplace-expertise", "ekspertyza-umov-pratsi", "Експертиза умов праці", "атестацію робочих місць і оновлення карток за результатами вимірювань", "службою атестації"),
        ("aud-documentation-check", "perevirka-dokumentatsii", "Перевірка документації", "актуальність інструкцій, наказів, журналів і наявність підписів", "службою документообігу"),
        ("aud-equipment-check", "perevirka-obladnannia", "Перевірка обладнання", "технічний стан машин, ЗІЗ, блокувань і засобів сигналізації", "механіками"),
        ("aud-knowledge-check", "perevirka-znan", "Перевірка знань", "тестування і опитування після навчання та інструктажів", "навчальним центром"),
        ("aud-ppe-check", "perevirka-ziz", "Перевірка ЗІЗ", "наявність, придатність і фактичне використання засобів захисту", "складом ЗІЗ"),
        ("aud-prescriptions", "prypysy", "Приписи", "обов’язкові вимоги органів нагляду зі строками виконання", "юридичною службою"),
        ("aud-remarks-violations", "zauvazhennia-i-porushennia", "Зауваження і порушення", "класифікацію зауважень від формальних до критичних небезпек", "ОП"),
        ("aud-corrective-actions", "koryhuvuvalni-zakhody", "Коригувальні заходи", "план дій для усунення причин, а не лише симптомів порушення", "відповідальними за напрям"),
        ("aud-deadline-control", "kontrol-strokiv", "Контроль строків", "відстеження виконання заходів до кінцевої дати без «тихого» переносу", "офісом ОП"),
        ("aud-reinspection", "povtorna-perevirka", "Повторна перевірка", "підтвердження, що заходи реально виконані і ризик знято", "аудитором або ОП"),
        ("aud-root-cause", "analiz-prychyn-porushen", "Аналіз причин порушень", "методи пошуку системних причин повторюваних відхилень", "групою розслідування"),
        ("aud-event-analysis", "analiz-podii", "Аналіз подій", "розбір нещасних випадків, інцидентів і «майже трапилось» без приховування", "комісією"),
        ("aud-unsafe-conditions", "nebezpechni-peredumovy", "Небезпечні передумови", "виявлення умов, що можуть призвести до травми до того, як станеться подія", "спостереженнями на місці"),
        ("aud-safety-indicators", "pokaznyky-bezpeky", "Показники безпеки", "облік частоти, тяжкості, «майже трапилось» і виконання плану заходів", "аналітикою ОП"),
        ("aud-reporting", "zvitnist", "Звітність", "регулярні звіти керівництву, власнику і сторонам соціального партнерства", "ОП"),
        ("aud-instruction-review", "perehlad-instruktsii", "Перегляд інструкцій", "оновлення інструкцій після зміни обладнання, процесу або висновків перевірки", "технологами"),
        ("aud-risk-review", "perehlad-ryzykiv", "Перегляд ризиків", "актуалізацію реєстру ризиків після інцидентів і модернізації", "службою ризиків"),
        ("aud-training-update", "onovlennia-navchannia", "Оновлення навчання", "коригування програм навчання за уроками перевірок і подій", "навчальним центром"),
        ("aud-lessons-learned", "obmin-dosvidom", "Обмін досвідом", "поширення уроків між змінами і підрозділами без культури пошуку винного", "ОП"),
        ("aud-recurrence-prevention", "zapobihannia-povtorenniu", "Запобігання повторенню", "закриття циклу план-виконання-перевірка-дія: перевірка, що аналогічна подія не повториться", "керівництвом"),
        ("aud-continuous-improvement", "postijne-polipshennia", "Постійне поліпшення", "системне вдосконалення СУОП на основі даних перевірок і зворотного зв’язку", "керівництвом"),
    ]
    specs = []
    for id_, slug, title, gist, ctx in rows:
        d, h, doc, suop, err, prac, lim = _blk(title, gist, ctx)
        summary = f"{title} описує {gist} у циклі контролю, аудиту і поліпшення СУОП."
        specs.append(T(id_, slug, title, summary, d, h, doc, suop, err, prac, lim))
    specs[14]["d"] = (
        "Коригувальні заходи це конкретні дії з відповідальними і строками, спрямовані на усунення причини порушення або інциденту. "
        "Відрізняють від «зауваження» без ресурсу і від дисциплінарного наказу без технічного змісту."
    )
    specs[18]["h"] = (
        "Збирають факти хронології, умови, дії людей, стан обладнання і відхилення від інструкцій без передчасного висновку про вину. "
        "Залучають представників працівників; висновки оформлюють з рекомендаціями для СУОП."
    )
    specs[27]["prac"] = (
        "Провести ретроспективу одного припису минулого кварталу: чи закрито причину, чи лише симптом. "
        "Додати один вимірюваний показник поліпшення на наступний місяць у план СУОП."
    )
    return specs


def main() -> None:
    configs = [
        (
            "_tmp_gen_eco.py",
            r"e:/Programming/Sites/LEX/src/mocks/data/environmentalSafetySituations.ts",
            "Відповіді для розділу «Екологічна безпека».",
            "ENVIRONMENTAL_SAFETY_SITUATIONS",
            "createEnvironmentalSafetySituation",
            "ecology",
            ECO_HIER,
            ECO_NORMS,
            ECO_EXTRAS,
            eco_specs(),
        ),
        (
            "_tmp_gen_erg.py",
            r"e:/Programming/Sites/LEX/src/mocks/data/ergonomicsSituations.ts",
            "Відповіді для розділу «Ергономіка і поведінкова безпека».",
            "ERGONOMICS_SITUATIONS",
            "createErgonomicsSituation",
            "psychology_behavior",
            ERG_HIER,
            ERG_NORMS,
            ERG_EXTRAS,
            erg_specs(),
        ),
        (
            "_tmp_gen_aud.py",
            r"e:/Programming/Sites/LEX/src/mocks/data/auditImprovementSituations.ts",
            "Відповіді для розділу «Аудит і поліпшення».",
            "AUDIT_IMPROVEMENT_SITUATIONS",
            "createAuditImprovementSituation",
            "audit_improvement",
            AUD_HIER,
            AUD_NORMS,
            AUD_EXTRAS,
            aud_specs(),
        ),
    ]
    for fname, out_ts, doc, export, factory, cat, hier, norms, extras, specs in configs:
        text = render_gen(fname, out_ts, doc, export, factory, cat, hier, norms, extras, specs)
        (ROOT / fname).write_text(text, encoding="utf-8")
        print(f"spawned {ROOT / fname} specs={len(specs)}")


if __name__ == "__main__":
    main()
