# Резолюции пилота: s01-l01 (10 блоков)

Источник: `lecture-work/semantic-maps/subject-01/extracts/lecture-01/TEXT.md`  
(собрано из cache `maps/_extract_cache/01_…/cf2f7a6690d0a8e8.json` ← Lessons «Конспект лекцій до тем 1-2.pdf»)

Агенты рецензии: **роли A и B разделены** (два прохода в одном исполнении).  
Insert в mock: **сделан для пилота** (`status=inserted`, verification=`under_review`).

`phase_id` в продукте для technology_processes: рабочий слот — `preparation` (остальные `isApplicable: false`).

Полки сверены с `src/domain/referenceSections.ts` и `src/mocks/data/technologyProcessesSituations.ts`.

Порог `MIN_CHARS_NEW_SITUATION=2000`: новые карточки созданы только там, где сумма excerpt на slug > 2000.

---

## Рецензент A — блок ↔ вопрос

| block_id | catalog_question_id | proposed_question | block_type | confidence | note (agent-a) |
|---|---|---|---|---:|---|
| `s01-l01-b001` | Q-MET-001 | — | `definition` | 0.94 | Пряме визначення металургії та кола процесів. |
| `s01-l01-b002` | Q-MET-002 | — | `definition` | 0.93 | Порівняння піро- і гідрометалургії — окремий читацький питання. |
| `s01-l01-b003` | Q-MET-003 | — | `definition` | 0.91 | Руда + бракувальна межа — операційний термін сировини. |
| `s01-l01-b004` | Q-MET-004 | — | `definition` | 0.90 | Пуста порода кисла/основна — окреме питання від «що таке руда». |
| `s01-l01-b005` | Q-MET-005 | — | `norm` | 0.88 | Перелік видів палива для пірометалургії. |
| `s01-l01-b006` | Q-MET-006 | — | `definition` | 0.92 | Вогнетриви/футерівка — свій питання, не змішувати з флюсами. |
| `s01-l01-b007` | Q-MET-007 | — | `procedure` | 0.91 | Флюси, самоплавка, роль шлаку — сусідній, але окремий питання від вогнетривів. |
| `s01-l01-b008` | Q-MET-008 | — | `norm` | 0.86 | Додаткові матеріали (кисень, гази, феросплави). |
| `s01-l01-b009` | Q-MET-009 | — | `definition` | 0.93 | Чорна/кольорова металургія + двоступінчата схема сталі. |
| `s01-l01-b010` | Q-MET-010 | — | `procedure` | 0.90 | Сировина доменної плавки / типи залізних руд (початок). |

## Рецензент B — вопрос ↔ полка

| block_id | section_id | situation_slug | phase_id | placement_mode | target_kind | proposed_subsection | confidence | note (agent-b) |
|---|---|---|---|---|---|---|---:|---|
| `s01-l01-b001` | `technology_processes` | `metalurhiini-protsesy` | `preparation` | `append` | `situation` | Що таке металургія (з архівної лекції) | 0.92 | Існуюча картка «Металургійні процеси» — той самий питання. chars_for_slug append. |
| `s01-l01-b002` | `technology_processes` | `piro-ta-chorna-kolorova-metalurhiia` | `preparation` | `new` | `situation` | Піро- та гідрометалургійні методи | 0.88 | Сміливіше `new`: окремий питання від загальної картки. Група з b009: chars≈2178 > 2000 → insert. |
| `s01-l01-b003` | `technology_processes` | `syrovyna-i-materialy` | `preparation` | `append` | `situation` | Що таке руда і бракувальна межа | 0.90 | Існуюча «Сировина і матеріали». |
| `s01-l01-b004` | `technology_processes` | `syrovyna-i-materialy` | `preparation` | `append` | `situation` | Пуста порода: кисла та основна | 0.87 | Новий підрозділ у тій же картці (майже-дубль питання ок). |
| `s01-l01-b005` | `technology_processes` | `syrovyna-i-materialy` | `preparation` | `append` | `situation` | Паливо для пірометалургійних процесів | 0.85 | Короткий блок — append ок. |
| `s01-l01-b006` | `technology_processes` | `vohnetryvy-fliusy-ta-shlak` | `preparation` | `new` | `situation` | Вогнетриви та футерівка печей | 0.89 | Нова картка; група з b007: chars≈2541 > 2000 → insert. |
| `s01-l01-b007` | `technology_processes` | `vohnetryvy-fliusy-ta-shlak` | `preparation` | `new` | `situation` | Флюси, самоплавка руда і роль шлаку | 0.88 | Той самий slug, другий підрозділ (не змішувати в один підрозділ з вогнетривами). |
| `s01-l01-b008` | `technology_processes` | `syrovyna-i-materialy` | `preparation` | `append` | `situation` | Додаткові матеріали металургійних процесів | 0.84 | Append у сировину. |
| `s01-l01-b009` | `technology_processes` | `piro-ta-chorna-kolorova-metalurhiia` | `preparation` | `new` | `situation` | Чорна і кольорова металургія; двоступінчатий спосіб сталі | 0.90 | Разом із b002 на новий slug (поріг пройдено). |
| `s01-l01-b010` | `technology_processes` | `metalurhiini-protsesy` | `preparation` | `append` | `situation` | Виробництво чавуну: сировина для доменної плавки | 0.86 | chars_for_slug alone 963 < 2000 → не нова картка; append у металургійні процеси (видимість для власника). |

## Сводная таблица placements (минимум SCHEMA)

| block_id | from_phrase | to_phrase | block_type | catalog_question_id | proposed_question | section_id | situation_slug | phase_id | placement_mode | target_kind | confidence | resolution | status | notes |
|---|---|---|---|---|---|---|---|---|---|---|---:|---|---|---|
| `s01-l01-b001` | Металургія — це галузь науки й техніки та галузь промисловості | форми й властивостей. | `definition` | Q-MET-001 | — | `technology_processes` | `metalurhiini-protsesy` | `preparation` | `append` | `situation` | 0.93 | `approve` | `inserted` | mock_ref=`metalurhiini-protsesy`; agent-a/b згодні; verification=under_review |
| `s01-l01-b002` | Основними з цих методів є пірометалургійні та гідрометалургійні. | тільки пірометалургійні процеси і розглядатимуться. | `definition` | Q-MET-002 | — | `technology_processes` | `piro-ta-chorna-kolorova-metalurhiia` | `preparation` | `new` | `situation` | 0.90 | `approve` | `inserted` | chars_for_slug≈2178 з b009; mock_ref=`piro-ta-chorna-kolorova-metalurhiia` |
| `s01-l01-b003` | Руда –  це корисна копалина, яка добувається з надр землі. | межа знижується. | `definition` | Q-MET-003 | — | `technology_processes` | `syrovyna-i-materialy` | `preparation` | `append` | `situation` | 0.90 | `approve` | `inserted` | mock_ref=`syrovyna-i-materialy` |
| `s01-l01-b004` | В гірських породах корисний метал знаходиться, як правило, у вигляді | а якщо з CaO  і  MgO – то основною. | `definition` | Q-MET-004 | — | `technology_processes` | `syrovyna-i-materialy` | `preparation` | `append` | `situation` | 0.88 | `approve` | `inserted` | новий підрозділ |
| `s01-l01-b005` | Паливо є необхідним матеріалом для здійснення пірометалургійних | пилоподібним (кам'яне вугілля). | `norm` | Q-MET-005 | — | `technology_processes` | `syrovyna-i-materialy` | `preparation` | `append` | `situation` | 0.86 | `approve` | `inserted` | короткий excerpt — append |
| `s01-l01-b006` | Вогнетриви –  це матеріали, із яких викладається футерівка | кам'яновугільної смоли. | `definition` | Q-MET-006 | — | `technology_processes` | `vohnetryvy-fliusy-ta-shlak` | `preparation` | `new` | `situation` | 0.90 | `approve` | `inserted` | chars_for_slug≈2541 з b007 |
| `s01-l01-b007` | Флюси. Флюсами називаються речовини, які додаються до шихти для то- | плавиковий шпат (CaF2) \nта ін. | `procedure` | Q-MET-007 | — | `technology_processes` | `vohnetryvy-fliusy-ta-shlak` | `preparation` | `new` | `situation` | 0.89 | `approve` | `inserted` | окремий підрозділ у новій картці |
| `s01-l01-b008` | Додаткові матеріали. В металургійних процесах широко застосовують- | доводять метал до потрібної кондиції. | `norm` | Q-MET-008 | — | `technology_processes` | `syrovyna-i-materialy` | `preparation` | `append` | `situation` | 0.85 | `approve` | `inserted` | mock_ref=`syrovyna-i-materialy` |
| `s01-l01-b009` | В сучасній техніці історично склався поділ металургії на чорну та кольоро- | технологій для здійснення такого процесу. | `definition` | Q-MET-009 | — | `technology_processes` | `piro-ta-chorna-kolorova-metalurhiia` | `preparation` | `new` | `situation` | 0.91 | `approve` | `inserted` | з b002 на новий slug |
| `s01-l01-b010` | 3.2 ВИРОБНИЦТВО ЧАВУНУ | збагачення залізних руд; | `procedure` | Q-MET-010 | — | `technology_processes` | `metalurhiini-protsesy` | `preparation` | `append` | `situation` | 0.88 | `approve` | `inserted` | below_min_chars для окремої картки; append для видимості |

### Легенда

- `approve` + `inserted` — для цього прогона владельцем задан явный insert (увидеть в UI).
- Полные `excerpt` — в `cuts/s01-l01-pilot-10.md`.
- Код insert: `src/mocks/data/technologyProcessesS01Pilot.ts`.
