# Резолюции пилота: s12-l01 (10 блоков)

Источник: `lecture-work/semantic-maps/subject-12/extracts/lecture-01/TEXT.md`

Агенты рецензии: **имитация ролей A и B** (последовательно в одном прогоне). Insert в mock: **off**.

`phase_id` — как в продукте (`ActionPhaseId`): `preparation` … `recovery` (в SCHEMA кратко указано «improvement»; в коде 6-й этап — `recovery`).

Полки сверены с `src/domain/referenceSections.ts` и seed-файлами `src/mocks/data/*Situations.ts`.

---

## Рецензент A — блок ↔ вопрос

| block_id | catalog_question_id | proposed_question | block_type | confidence | обоснование |
|---|---|---|---|---:|---|
| `s12-l01-b001` | Q-DOC-011 | — | `norm` | 0.92 | Кусок прямо перечисляет законы и международные документы — это ответ на вопрос о нормативно-правовой базе. |
| `s12-l01-b002` | — | Як групують норми з охорони праці і що входить до кожної групи? | `definition` | 0.78 | Это учебная классификация норм на 4 группы. Вопрос Q-DOC-011 слишком общий; в каталоге отдельного вопроса нет. |
| `s12-l01-b003` | Q-DOC-012 | — | `norm` | 0.95 | Статья 13: работодатель обязан создать и обеспечить работу СУОП — ядро вопроса про систему управления. |
| `s12-l01-b004` | Q-DOC-015 | — | `norm` | 0.86 | Текст про положения, инструкции и другие акты предприятия. Основной якорь — Q-DOC-015; инструкции (Q-DOC-014) рядом, но полка локальных актов покрывает оба. |
| `s12-l01-b005` | Q-DOC-017 | — | `procedure` | 0.88 | Как проводить и чем подтверждать инструктаж при дистанционной/надомной работе — это про виды инструктажа и фиксацию. |
| `s12-l01-b006` | — | Коли на підприємстві створювати службу охорони праці, а коли достатньо сумісника чи зовнішнього фахівця? | `norm` | 0.86 | Пороги 50 / меньше 50 / меньше 20 работников. В каталоге нет отдельного вопроса именно про порог численности. |
| `s12-l01-b007` | Q-DOC-016 | — | `norm` | 0.94 | Статья 18 прямо про обучение, инструктажи и специальное обучение для работ повышенной опасности. |
| `s12-l01-b008` | Q-DOC-022 | — | `norm` | 0.91 | Когда нужен дозвіл на опасные работы и оборудование — совпадает с Q-DOC-022. |
| `s12-l01-b009` | Q-TERM-001 | — | `definition` | 0.84 | Это определение термина СУОП и уровней системы. Рецензент A считает это скорее термином, чем отдельной рабочей ситуацией. |
| `s12-l01-b010` | Q-DOC-001 | — | `form_ref` | 0.87 | Перечень журналов, протоколов и удостоверений по обучению — вопрос «какой журнал/документ нужен». |

## Рецензент B — вопрос ↔ полка

| block_id | section_id | situation_slug | phase_id | placement_mode | target_kind | confidence | обоснование |
|---|---|---|---|---|---|---:|---|
| `s12-l01-b001` | `safety_management` | `proposed_normatyvno-pravova-baza-dokumentatsii-op` | `preparation` | `new` | `situation` | 0.74 | Готовой карточки «нормативная база документации ОП» в mock нет. Раздел documents_records в каталоге ситуаций как обычная полка не наполнен (standalone-модуль). Предлагаю новую ситуацию в «Організація охорони праці». |
| `s12-l01-b002` | `safety_management` | `pobudova-ta-funktsionuvannia-suop` | `preparation` | `append` | `situation` | 0.55 | Можно дописать как учебный фон к СУОП, но это слабо операционно. Альтернатива — skip как context. Не уверен, что нужна отдельная карточка. |
| `s12-l01-b003` | `safety_management` | `orhanizatsiia-oboviazkiv-robotodavtsia` | `preparation` | `append` | `situation` | 0.93 | Существующая карточка «Організація виконання обов’язків роботодавця» (safetyManagementSituations.ts) — прямое попадание. Дополнить цитатой ст. 13. |
| `s12-l01-b004` | `safety_management` | `lokalni-normatyvni-dokumenty-z-okhorony-pratsi` | `preparation` | `append` | `situation` | 0.90 | Существует slug lokalni-normatyvni-dokumenty-z-okhorony-pratsi. Текст про акты предприятия — дополнение, не новая полка. |
| `s12-l01-b005` | `rights_relations` | `dystantsiina-robota` | `preparation` | `append` | `situation` | 0.89 | Существует slug dystantsiina-robota в rightsRelationsSituations.ts. Сюда, а не в общую карточку инструктажей — контекст именно дистанционной работы. |
| `s12-l01-b006` | `safety_management` | `robota-bez-okremoi-sluzhby-okhorony-pratsi` | `preparation` | `append` | `situation` | 0.70 | Пороги численности ближе к карточке «Робота без окремої служби…». Часть смысла также есть в orhanizatsiia-okhorony-pratsi-na-malomu-pidpryiemstvi — возможный спор двух полок. |
| `s12-l01-b007` | `worker_admission` | `navchannia-z-okhorony-pratsi` | `preparation` | `append` | `situation` | 0.92 | Существует slug navchannia-z-okhorony-pratsi. Специальное обучение можно позже продублировать/связать со spetsialne-navchannia, но базово — сюда. |
| `s12-l01-b008` | `high_risk_work` | `proposed_dozvil-na-roboty-ta-ustatkuvannia-pidvyshchenoi-nebezpeky` | `preparation` | `new` | `situation` | 0.80 | В highRiskWorkSituations есть roboty-pidvyshchenoi-nebezpeky и nariad-dopusk, но отдельной карточки про дозвіл (разрешение) нет. eco/dozvilni-dokumenty — другая полка (экология), не брать. |
| `s12-l01-b009` | `safety_management` | `pobudova-ta-funktsionuvannia-suop` | `preparation` | `append` | `situation` | 0.91 | Карточка «Побудова та функціонування СУОП» уже содержит блок «Що таке СУОП…». Рецензент B против отдельного термина: лучше дополнить ситуацию. |
| `s12-l01-b010` | `worker_admission` | `perevirka-znan` | `preparation` | `append` | `situation` | 0.76 | Список документов обучения логично дописать в «Перевірка знань» (есть подраздел Документи). Параллельно в forms есть zhurnal-registracii-instruktazhey — не дублировать как вторую главную полку без решения владельца. |

## Сводная таблица placements (минимум SCHEMA)

| block_id | from_phrase | to_phrase | block_type | catalog_question_id | proposed_question | section_id | situation_slug | phase_id | placement_mode | target_kind | confidence | resolution | status | notes |
|---|---|---|---|---|---|---|---|---|---|---|---:|---|---|---|
| `s12-l01-b001` | Законодавство України, нормативно-правова база та міжнародні документи у сфер… | двосторонні договори та угоди | `norm` | Q-DOC-011 | — | `safety_management` | `proposed_normatyvno-pravova-baza-dokumentatsii-op` | `preparation` | `new` | `situation` | 0.83 | `pending` | `draft_cut` | Оба согласны по смыслу, но нужна новая карточка — полку подтверждает владелец |
| `s12-l01-b002` | Усі норми стосовно охорони праці умовно поділяються на чотири групи | а також відповідальність за його порушення. | `definition` | — | Як групують норми з охорони праці і що входить до кожної групи? | `safety_management` | `pobudova-ta-funktsionuvannia-suop` | `preparation` | `append` | `situation` | 0.67 | `pending` | `draft_cut` | A предлагает новый вопрос; B сомневается (append/skip) |
| `s12-l01-b003` | Стаття 13. Управління охороною праці та обов'язки роботодавця | забезпечує виконання необхідних профілактичних заходів відповідно до обставин… | `norm` | Q-DOC-012 | — | `safety_management` | `orhanizatsiia-oboviazkiv-robotodavtsia` | `preparation` | `append` | `situation` | 0.94 | `proposed` | `proposed` | A и B согласны: вопрос и полка совместимы. |
| `s12-l01-b004` | розробляє і затверджує положення, інструкції, інші акти з охорони праці | забезпечує безоплатно працівників нормативно-правовими актами та актами підпр… | `norm` | Q-DOC-015 | — | `safety_management` | `lokalni-normatyvni-dokumenty-z-okhorony-pratsi` | `preparation` | `append` | `situation` | 0.88 | `proposed` | `proposed` | A и B согласны: вопрос и полка совместимы. |
| `s12-l01-b005` | При укладенні трудового договору про дистанційну роботу | що передаються працівнику для виконання дистанційної роботи. | `procedure` | Q-DOC-017 | — | `rights_relations` | `dystantsiina-robota` | `preparation` | `append` | `situation` | 0.89 | `proposed` | `proposed` | A и B согласны: вопрос и полка совместимы. |
| `s12-l01-b006` | На підприємстві з кількістю працюючих 50 і більше осіб | сторонні спеціалісти на договірних засадах, які мають відповідну підготовку. | `norm` | — | Коли на підприємстві створювати службу охорони праці, а коли достатньо сумісника чи зовнішнього фахівця? | `safety_management` | `robota-bez-okremoi-sluzhby-okhorony-pratsi` | `preparation` | `append` | `situation` | 0.78 | `pending` | `draft_cut` | A — новый вопрос про пороги; B — append в одну из двух существующих карточек службы |
| `s12-l01-b007` | Стаття 18. Навчання з питань охорони праці | Перелік робіт з підвищеною небезпекою затверджується центральним органом вико… | `norm` | Q-DOC-016 | — | `worker_admission` | `navchannia-z-okhorony-pratsi` | `preparation` | `append` | `situation` | 0.93 | `proposed` | `proposed` | A и B согласны: вопрос и полка совместимы. |
| `s12-l01-b008` | Роботодавець повинен одержати дозвіл на виконання робіт підвищеної небезпеки | що реалізує державну політику у сфері охорони праці. | `norm` | Q-DOC-022 | — | `high_risk_work` | `proposed_dozvil-na-roboty-ta-ustatkuvannia-pidvyshchenoi-nebezpeky` | `preparation` | `new` | `situation` | 0.85 | `pending` | `draft_cut` | Вопрос ясен; B предлагает новую карточку дозволу — нужно решение владельца new vs append к roboty-pidvyshchenoi-nebezpeky |
| `s12-l01-b009` | СУОП це сукупність об’єкта та суб’єкта управління, що взаємодіють між собою з… | (далі  ідприємств) незалежно від форм власності та видів їх діяльності. | `definition` | Q-TERM-001 | — | `safety_management` | `pobudova-ta-funktsionuvannia-suop` | `preparation` | `append` | `situation` | 0.88 | `pending` | `draft_cut` | A — термин (Q-TERM-001); B — дополнить ситуацию СУОП |
| `s12-l01-b010` | Порядком проведення навчання і перевірки знань з питань охорони праці на підп… | зареєстроване в Мін’юсті України 15.02.2005 за № 231/10511 | `form_ref` | Q-DOC-001 | — | `worker_admission` | `perevirka-znan` | `preparation` | `append` | `situation` | 0.81 | `pending` | `draft_cut` | A смотрит как на бланк/журнал; B — дополнение карточки проверки знаний |

### Легенда resolution / status

- `proposed` — оба согласны, уверенность высокая; **не** approve, в сайт не писали.
- `pending` + `draft_cut` — нужно решение владельца (спор, новая карточка, сомнение полки).
- Полные `excerpt` — в `cuts/s12-l01-pilot-10.md`.
