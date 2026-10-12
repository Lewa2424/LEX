# -*- coding: utf-8 -*-
"""Build lecture-1 blocks + quote snippets (UTF-8 files)."""
from pathlib import Path
import json
from datetime import date

ROOT = Path(r"e:\Programming\Sites\LEX\development data\lecture-work\lectures\bezpeka-obiektiv-ta-terytorii")
ROOT.mkdir(parents=True, exist_ok=True)

LECTURE = "Безпека об’єктів та територій.pdf"
STABLE = "bezpeka-obiektiv-ta-terytorii"
MARK = "[Цитата з архівної лекції «Безпека об’єктів та територій» — не НПА; потрібна перевірка за офіційним джерелом]"

blocks = [
  {
    "id": "b01",
    "theme": "Визначення НС",
    "pages": [3],
    "status": "placed",
    "targets": [
      {"situationSlug": "klasyfikatsiia-ta-rivni-ns", "phase": "identification", "subsection": "Визначення надзвичайної ситуації", "role": "proposed+placed_in_new"}
    ],
    "quote": f"{MARK} Надзвичайна ситуація (НС) — порушення нормальних умов життя та діяльності людей на окремій території чи об'єкті на ній або на водному об'єкті, спричинене аварією, катастрофою, стихійним лихом чи іншою небезпечною подією, зокрема епідемією, епізоотією, епіфітотією, пожежею, що призвело (може призвести) до виникнення великої кількості постраждалих, загрози життю та здоров'ю людей, їх загибелі, значних матеріальних утрат, а також до неможливості проживання населення на території чи об'єкті, ведення там господарської діяльності."
  },
  {
    "id": "b02",
    "theme": "Причини виникнення НС",
    "pages": [4],
    "status": "placed",
    "targets": [
      {"situationSlug": "klasyfikatsiia-ta-rivni-ns", "phase": "identification", "subsection": "Причини виникнення НС"}
    ],
    "quote": f"{MARK} Причини виникнення надзвичайних ситуацій: стихійні явища; особливо небезпечні інфекції; вплив зовнішніх природних чинників; проектно-виробничі дефекти споруд; дія технологічних процесів промислового виробництва на матеріали споруд."
  },
  {
    "id": "b03",
    "theme": "Класифікатор НС (посилання на наказ)",
    "pages": [5],
    "status": "placed",
    "targets": [
      {"situationSlug": "klasyfikatsiia-ta-rivni-ns", "phase": "identification", "subsection": "Посилання на класифікатор НС"},
      {"situationSlug": "klasyfikatsiia-ta-rivni-ns", "phase": "preparation", "subsection": "Посилання на офіційні класифікатори"}
    ],
    "quote": f"{MARK} Класифікатор надзвичайних ситуацій (затверджено наказом Держспоживстандарту України від 11.10.2010 р. № 457). Класифікації підлягають НС (виявлені й можливі)."
  },
  {
    "id": "b04",
    "theme": "НС за походженням",
    "pages": [6],
    "status": "placed",
    "targets": [
      {"situationSlug": "klasyfikatsiia-ta-rivni-ns", "phase": "identification", "subsection": "Класифікація НС за походженням"}
    ],
    "quote": f"{MARK} За походженням розрізняють: НС техногенного характеру; НС природного характеру; НС соціального характеру; НС воєнного характеру."
  },
  {
    "id": "b05",
    "theme": "Критерії рівня НС",
    "pages": [7],
    "status": "placed",
    "targets": [
      {"situationSlug": "klasyfikatsiia-ta-rivni-ns", "phase": "identification", "subsection": "Критерії визначення рівня НС"}
    ],
    "quote": f"{MARK} Критерії визначення рівня надзвичайної ситуації включають територіальне поширення та обсяги технічних і матеріальних ресурсів, що необхідні для ліквідації наслідків надзвичайної ситуації, а також кількість постраждалих."
  },
  {
    "id": "b06",
    "theme": "НС природного характеру — види",
    "pages": [8, 9],
    "status": "placed",
    "targets": [
      {"situationSlug": "klasyfikatsiia-ta-rivni-ns", "phase": "identification", "subsection": "Види небезпечних стихійних явищ"}
    ],
    "quote": f"{MARK} Надзвичайні ситуації природного характеру класифікують за видами небезпечних стихійних явищ: геофізичні та геологічні небезпечні явища (землетрус, виверження вулкану, зсув, обвал, осип, карст); метеорологічні небезпечні явища."
  },
  {
    "id": "b07",
    "theme": "Радіаційно небезпечний об'єкт",
    "pages": [21],
    "status": "placed",
    "targets": [
      {"situationSlug": "avariya-na-opasnom-proizvodstvennom-obekte", "phase": "identification", "subsection": "Радіаційно небезпечні об'єкти"},
      {"situationSlug": "tekhnohenna-bezpeka-ta-plla-opn", "phase": "identification", "subsection": "Радіаційно небезпечні об'єкти"}
    ],
    "quote": f"{MARK} Радіаційно небезпечний об'єкт — об'єкт, на якому зберігають, переробляють, використовують або транспортують радіоактивні речовини (РР), при аварії на якому або його руйнуванні може виникнути небезпека радіоактивного забруднення."
  },
  {
    "id": "b08",
    "theme": "Гідротехнічні споруди",
    "pages": [26],
    "status": "placed",
    "targets": [
      {"situationSlug": "tekhnohenna-bezpeka-ta-plla-opn", "phase": "identification", "subsection": "Гідротехнічні споруди"}
    ],
    "quote": f"{MARK} Гідротехнічна споруда — це господарський об'єкт, споруда, що знаходиться поблизу водної поверхні та призначається для використання кінетичної енергії руху води з метою перетворювання її в інші види енергії, а також для інших водогосподарських цілей."
  },
  {
    "id": "b09",
    "theme": "Моніторинг НС природного характеру → ДСНС",
    "pages": [39],
    "status": "placed",
    "targets": [
      {"situationSlug": "avariya-na-opasnom-proizvodstvennom-obekte", "phase": "identification", "subsection": "Організація моніторингу НС"},
      {"situationSlug": "ocenka-professionalnyh-riskov-opr", "phase": "identification", "subsection": "Моніторинг загроз НС"}
    ],
    "quote": f"{MARK} Моніторингові дані щодо загрози виникнення та/або виникнення НС природного характеру надаються суб'єктами моніторингу до ДСНС України з метою виявлення негативних явищ і змін у довкіллі, що можуть призвести до НС."
  },
  {
    "id": "b10",
    "theme": "Прогнозування НС техногенного характеру",
    "pages": [42],
    "status": "placed",
    "targets": [
      {"situationSlug": "ocenka-professionalnyh-riskov-opr", "phase": "prevention", "subsection": "Прогнозування НС техногенного характеру"},
      {"situationSlug": "avariya-na-opasnom-proizvodstvennom-obekte", "phase": "preparation", "subsection": "Прогнозування сценаріїв аварій"}
    ],
    "quote": f"{MARK} Для встановлення ступеню ризику НС техногенного характеру визначаються розрахункові сценарії можливих великих аварій, що призводять до НС."
  },
  {
    "id": "b11",
    "theme": "Прогнозування НС природного характеру",
    "pages": [43],
    "status": "placed",
    "targets": [
      {"situationSlug": "ocenka-professionalnyh-riskov-opr", "phase": "prevention", "subsection": "Прогнозування природних небезпек"}
    ],
    "quote": f"{MARK} Під час розроблення заходів щодо попередження НС, джерелами яких є небезпечні природні процеси, передбачаються: визначення природно-кліматичних умов в районі розташування об'єкта; оцінка небезпечних природних процесів."
  },
  {
    "id": "b12",
    "theme": "Посилання на ДСНС (оперативна інформація)",
    "pages": [45],
    "status": "placed",
    "targets": [
      {"situationSlug": "klasyfikatsiia-ta-rivni-ns", "phase": "preparation", "subsection": "Посилання на оперативну інформацію ДСНС"},
      {"situationSlug": "avariya-na-opasnom-proizvodstvennom-obekte", "phase": "preparation", "subsection": "Посилання на ДСНС"}
    ],
    "quote": f"{MARK} На сайті ДСНС (URL: https://dsns.gov.ua/operational-information/nadzvicaini-situaciyi-v-ukrayini-2) можна ознайомитись з інформацією щодо тенденцій виникнення НС природного та техногенного характеру та пропозицій щодо запобігання."
  },
  {
    "id": "b13",
    "theme": "РіНР на радіаційно небезпечних об'єктах",
    "pages": [56],
    "status": "placed",
    "targets": [
      {"situationSlug": "avariya-na-opasnom-proizvodstvennom-obekte", "phase": "response", "subsection": "РіНР при радіаційних аваріях"}
    ],
    "quote": f"{MARK} Особливості організації та проведення РІНР при аваріях на радіаційно небезпечних об'єктах: оповіщення населення про аварію і постійне його інформування про наявну обстановку та порядок дій в даних умовах."
  },
  {
    "id": "b14",
    "theme": "РіНР на хімічно небезпечних об'єктах",
    "pages": [57],
    "status": "placed",
    "targets": [
      {"situationSlug": "avariya-na-opasnom-proizvodstvennom-obekte", "phase": "response", "subsection": "РіНР при хімічних аваріях"}
    ],
    "quote": f"{MARK} При виникненні осередку хімічного ураження негайно оповіщаються робітники, службовці та населення, які опинилися в зоні зараження і в районах, яким загрожує небезпека зараження."
  },
  {
    "id": "b15",
    "theme": "Забезпечення техногенної безпеки на небезпечних об'єктах",
    "pages": [70],
    "status": "placed",
    "targets": [
      {"situationSlug": "tekhnohenna-bezpeka-ta-plla-opn", "phase": "prevention", "subsection": "Заходи на небезпечних об'єктах"},
      {"situationSlug": "avariya-na-opasnom-proizvodstvennom-obekte", "phase": "prevention", "subsection": "Техногенна безпека на об'єкті"}
    ],
    "quote": f"{MARK} Забезпечення техногенної безпеки на небезпечних об'єктах здійснюється шляхом: оцінки ризиків виникнення надзвичайних ситуацій техногенного характеру; інформування про надзвичайні ситуації техногенного характеру; виконання інших заходів техногенної безпеки."
  },
  {
    "id": "b16",
    "theme": "Техногенна безпека на небезпечних територіях",
    "pages": [72, 73],
    "status": "placed",
    "targets": [
      {"situationSlug": "tekhnohenna-bezpeka-ta-plla-opn", "phase": "prevention", "subsection": "Заходи на небезпечних територіях"}
    ],
    "quote": f"{MARK} Забезпечення техногенної безпеки на небезпечних територіях та у зонах можливого ураження від небезпечних об'єктів здійснюється з метою організації заходів захисту населення і територій."
  },
  {
    "id": "b17",
    "theme": "Інформування про НС техногенного характеру",
    "pages": [74, 222],
    "status": "placed",
    "targets": [
      {"situationSlug": "avariya-na-opasnom-proizvodstvennom-obekte", "phase": "response", "subsection": "Інформування про НС"},
      {"situationSlug": "tekhnohenna-bezpeka-ta-plla-opn", "phase": "response", "subsection": "Інформування"}
    ],
    "quote": f"{MARK} Інформування у разі виникнення надзвичайної ситуації техногенного характеру здійснюється негайно. Організація заходів техногенної безпеки включає інформування про надзвичайні ситуації техногенного характеру."
  },
  {
    "id": "b18",
    "theme": "Основні етапи ідентифікації ОПН",
    "pages": [84],
    "status": "placed",
    "targets": [
      {"situationSlug": "tekhnohenna-bezpeka-ta-plla-opn", "phase": "identification", "subsection": "Ідентифікація ОПН"}
    ],
    "quote": f"{MARK} Основні етапи ідентифікації об'єктів підвищеної небезпеки: складається перелік потенційно небезпечних об'єктів / небезпечних речовин та виконується ідентифікація щодо віднесення до ОПН відповідного класу."
  },
  {
    "id": "b19",
    "theme": "Посилання на форму ОПН-1",
    "pages": [88],
    "status": "placed",
    "targets": [
      {"situationSlug": "tekhnohenna-bezpeka-ta-plla-opn", "phase": "preparation", "subsection": "Посилання на повідомлення (форма ОПН-1)"}
    ],
    "quote": f"{MARK} Повідомлення (форма ОПН-1) — документ/форма, що згадується в лекції в блоці ідентифікації та повідомлення щодо об'єктів підвищеної небезпеки. [Увага: у витягу сторінка майже без тексту — ймовірно слайд/скан бланка; потрібен перегляд PDF.]"
  },
  {
    "id": "b20",
    "theme": "Зміст розділів ПЛЛА",
    "pages": [105],
    "status": "placed",
    "targets": [
      {"situationSlug": "avariya-na-opasnom-proizvodstvennom-obekte", "phase": "preparation", "subsection": "Зміст ПЛЛА"},
      {"situationSlug": "tekhnohenna-bezpeka-ta-plla-opn", "phase": "preparation", "subsection": "Основний зміст розділів ПЛЛА"}
    ],
    "quote": f"{MARK} Основний зміст окремих розділів ПЛЛА: схема та список оповіщення працівників; інструкція щодо безпечної зупинки технологічного процесу; перелік інструментів, матеріалів та засобів індивідуального захисту; повноваження осіб, відповідальних за виконання заходів."
  },
  {
    "id": "b21",
    "theme": "Допуск після навчання з ЦЗ / техногенної безпеки",
    "pages": [228],
    "status": "placed",
    "targets": [
      {"situationSlug": "pervichny-instruktazh-na-rabochem-meste", "phase": "preparation", "subsection": "Посилання на навчання з цивільного захисту"},
      {"situationSlug": "tekhnohenna-bezpeka-ta-plla-opn", "phase": "preparation", "subsection": "Навчання та допуск"}
    ],
    "quote": f"{MARK} Допуск до роботи працівників здійснюється тільки після проходження ними навчань, інструктажів і перевірки знань з питань цивільного захисту, зокрема з техногенної безпеки."
  },
  {
    "id": "b22",
    "theme": "Підвищення стійкості ОГ / аналіз руйнувань",
    "pages": [195],
    "status": "placed",
    "targets": [
      {"situationSlug": "avariya-na-opasnom-proizvodstvennom-obekte", "phase": "recovery", "subsection": "Підвищення стійкості роботи об'єкта"},
      {"situationSlug": "avariya-na-opasnom-proizvodstvennom-obekte", "phase": "investigation", "subsection": "Аналіз характеру руйнувань"}
    ],
    "quote": f"{MARK} Аналіз характеру і ступеня руйнувань на об'єкті дозволяє визначити загальну ситуацію в осередку ураження і спланувати заходи з підвищення стійкості роботи ОГ в умовах надзвичайних ситуацій."
  },
  {
    "id": "b23",
    "theme": "Медіа: Рисунок 3.1 — зони радіоактивного забруднення",
    "pages": [23, 141],
    "status": "ocr_queued",
    "targets": [],
    "quote": None,
    "mediaNote": "Стор. 23 майже без тексту («Зони радіоактивного забруднення»). Стор. 141 містить підпис «Рисунок 3.1 - Зони радіоактивного забруднення…» і текстовий опис зон, але сама схема/рисунок у витягу відсутня як зображення."
  },
  {
    "id": "b24",
    "theme": "Медіа: повторювані титульні/кінцеві слайди",
    "pages": [10, 28, 46, 61, 75, 93, 106],
    "status": "discarded",
    "targets": [],
    "quote": None,
    "discardReason": "Службові слайди «Дякую за увагу!» / повтори плану лекції без нового змісту; у витягу багато дублів через накладання слайдів."
  },
  {
    "id": "b25",
    "theme": "Навчальний хвіст (загальна теорія ЦЗ / стійкість / розвідка) — відкладено",
    "pages": [184, 206, 207],
    "status": "deferred_learning",
    "targets": [],
    "quote": f"{MARK} [Фрагмент для навчального контуру пізніше] Служба сховищ й укриттів оцінює інженерний захист робітників і службовців… До складу розвідувальних формувань бажано залучати людей, які знають дану місцевість…",
    "note": "Обсяжний навчальний матеріал про служби ЦЗ і організацію розвідки; у довідник ситуацій перенесено лише прикладні блоки. Решта — deferred_learning."
  },
]

assert not any(b["status"] == "unassigned" for b in blocks)

(ROOT / "blocks.json").write_text(
    json.dumps(
        {
            "lecture": LECTURE,
            "stableId": STABLE,
            "processedAt": str(date.today()),
            "language": "uk",
            "quotePolicy": "Цитати лекції (можливе легке злиття розривів рядків), не вільний переказ. Не verified НПА.",
            "unassignedCount": 0,
            "blocks": blocks,
        },
        ensure_ascii=False,
        indent=2,
    )
    + "\n",
    encoding="utf-8",
)

media = """# Медіа / OCR / проблеми витягу — лекція 1

## Проблеми якості тексту
- Багато **накладань слайдів**: у одному «сторінковому» блоці змішані план лекції + основний текст.
- Розриви слів (`Класифі ка ція`, `надзвич айних`) — типовий дефект PDF/експорту.
- Символи булетів приватного використання (`\\uf071`) у сирому витягу.

## Скани / рисунки / майже порожні сторінки
| стор. | що видно у витягу | дія |
|---:|---|---|
| 23 | лише заголовок «Зони радіоактивного забруднення» | `ocr_queued` / перегляд PDF |
| 88 | «Повідомлення (форма ОПН-1)» майже без тексту | ймовірно бланк-скан → `ocr_queued` |
| 141 | підпис «Рисунок 3.1…» + опис зон, без самого зображення | потрібен вивід рисунка |
| 10,28,46,… | «Дякую за увагу!» | discarded |

## Повторне використання підрозділів
Ті самі підрозділи (ПЛЛА, моніторинг, РіНР, ОПН) **можуть поповнюватися** наступними лекціями (ЦЗ, пожежна, БЕІМС тощо).
"""
(ROOT / "MEDIA.md").write_text(media, encoding="utf-8")
print("blocks", len(blocks), "unassigned", sum(1 for b in blocks if b["status"] == "unassigned"))
