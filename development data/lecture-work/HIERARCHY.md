# Дерево ієрархії довідника (1–2 контури)

Робочий документ редакційного каркасу.  
**1-й контур** — розділи (кошики) у UI.  
**2-й контур** — ситуації всередині розділу.  
**3-й контур** (6 етапів) — при наповненні: стиль **питання → відповідь**, без простинь НПА в одному підрозділі; повний шар — у `lecture-work` / «Посилання на…».

Лекції — джерела наповнення, **не** назви розділів.  
Дублікати ситуацій між розділами дозволені (напр. наряд-допуск).

Оновлено: 09.08.2026 (розділи 5–7: каркас 2-го контуру).  
**2026-09:** корпус у `../Lessons/` — 21 папка-предмет; легенда `stableId` / монолітні PDF нижче — **застаріла**, потрібен перемапінг після карт лекцій.

---

## 1. Підготовка та допуск `preparation_admission`

Статус 2-го контуру: **затверджено (дроблений під питання читача)**.  
Кожна ситуація = **одна відповідь на конкретне питання**; без простинь НПА.  
Кандидати джерел: `sections/01_preparation_admission/SOURCES.md`. План: `…/PLAN.md`.

| # | Ситуація / питання (2-й контур) | Mock | Джерела (орієнтир) |
|---:|---|---|---|
| 1.1 | Які види інструктажів з ОП існують і коли який застосовують? | новий | предмет 12, лекція 6; частково 13 |
| 1.2 | Як провести вступний інструктаж? | новий | 12 / лекція 6 |
| 1.3 | Як провести первинний інструктаж на робочому місці? | `sit-1` (перейменувати під питання) | 12 / лекція 6 |
| 1.4 | Коли і як проводити повторний інструктаж? | новий | 12 / лекція 6 |
| 1.5 | Коли потрібен позаплановий інструктаж? | новий | 12 / лекція 6 |
| 1.6 | Коли потрібен цільовий інструктаж? | новий | 12 / лекція 6 |
| 1.7 | Кого можна звільнити від повторного інструктажу? | `sit-prep-1-7` | 12 / лекція 6; уточнити первинний за Типовим положенням |
| 1.8 | Як організувати попередній медогляд при прийнятті на роботу? | винести з `sit-4` | 12 / лекція 8 |
| 1.9 | Як організувати періодичні медогляди? | винести з `sit-4` | 12 / лекція 8 |
| 1.10 | Що робити, якщо працівник не пройшов медогляд або має протипоказання? | новий | 12 / лекція 8; 4 |
| 1.11 | Як присвоїти I групу з електробезпеки неелектротехнічному персоналу? | `sit-10` | 13; 17; наявний densify |
| 1.12 | Як провести спеціальне навчання з питань ОП для працівників? | новий | 12 / лекція 5; 13 |
| 1.13 | Як провести навчання та перевірку знань посадових осіб з ОП? | новий | 12 / лекція 5 |
| 1.14 | Як оформити стажування (дублювання) і допуск до самостійної роботи? | винести з `sit-1` | 12; 13 |
| 1.15 | Коли потрібен наряд-допуск при виконанні робіт? | новий (дубль з розд. 6 ок) | 12 / лекції 12–13 |
| 1.16 | Які підготовчі обовʼязки роботодавця перед допуском працівника? | новий | 4; 13 |
| 1.17 | Які підготовчі обовʼязки працівника перед початком роботи? | новий | 4; 13 |

**Межі розділу:** повне оформлення журналів — розділ 2; повний правовий шар обовʼязків — розділ 3; навчання діям у НС / ЦЗ — інші розділи (з посиланнями).

---

## 2. Документація та облік `documentation`

Статус 2-го контуру: **затверджено (розширений каркас)**. Розділ пріоритетний для звернень; 3-й контур — компактний Q&A.

Тут — **оформлення та облік документів**. Повний процес допуску / розслідування / видачі ЗІЗ — у відповідних розділах (дублі ситуацій дозволені).

| # | Ситуація (2-й контур) | Mock / примітка | Лекції для наповнення (`stableId`) |

| 2.1 | Обов’язковий комплект документів з ОП на підприємстві | Нова; тема 1 лекції про документацію | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; частково `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 2.2 | Накази з охорони праці | Нова; тема 2 | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` |
| 2.3 | Інструкції з охорони праці (за професіями / видами робіт) | Нова; тема 3 | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 2.4 | Положення з охорони праці (служба ОП, СУОП тощо) | Нова; тема 4 | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 2.5 | Журнал реєстрації вступного інструктажу | Нова; бланк-родич у forms | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` (теми 5–6); `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 2.6 | Журнал реєстрації інструктажів на робочому місці | Нова; `form` журнал інструктажів | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 2.7 | Програми навчання та інструктажів | Нова; `form` програма вступного | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 2.8 | Протоколи (відомості) перевірки знань з питань ОП | Нова | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 2.9 | Списки працівників на медогляди | Нова; тема 8 (документи) | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` |
| 2.10 | Направлення на медогляд і облік медичних висновків | Нова; процес медогляду — у 1.2 | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; частково `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 2.11 | Особиста картка обліку видачі ЗІЗ | Нова; `form` картка ЗІЗ; дубль з розділом ЗІЗ ок | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` (тема 10); `zasoby-indyvidualnoho-zakhystu`; `syz` |
| 2.12 | Локальні норми безоплатної видачі ЗІЗ | Нова; `form` перелік професій і норм | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; `zasoby-indyvidualnoho-zakhystu`; `syz` |
| 2.13 | Дозвільні документи з охорони праці | Нова; тема 11 | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` |
| 2.14 | Заповнення, закриття та зберігання наряду-допуску | Нова тут; дубль з 1.7 / «Небезпечні роботи…»; `sit-2`, `form` наряд | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` (тема 12); `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 2.15 | Повідомлення про нещасний випадок | Нова; `form` повідомлення; процес — у розслідуванні | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` (тема 9); `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |
| 2.16 | Акти та матеріали розслідування (документальний комплект) | Нова; `form` акт Н-1; процес — у «Нещасні випадки…» | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` (тема 9); `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 2.17 | Документи атестації / оцінки умов праці на робочих місцях | Нова; тема 7; процес оцінки — у «Умови праці…» | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; частково `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 2.18 | Облік приписів, перевірок і виконання зауважень | Нова | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; частково `pravove-rehuliuvannia-trudovykh-vidnosyn`; далі — лекція з експертизи за потреби |

**Межі розділу:** не дублювати сюди повний алгоритм інструктажу/медогляду/розслідування — лише бланки, склад комплекту, підписи, строки зберігання, типові помилки оформлення.

## 3. Права, обовʼязки, регулювання `rights_regulation`

Статус 2-го контуру: **затверджено (розширений каркас — довідник, не шпаргалка)**.  
Підготовчі фрагменти обов’язків також у 1.8–1.9; тут — повний правовий шар (ОП + трудове право).  
3-й контур: питання → відповідь; довгі норми — через цитати/посилання, без простині в одному підрозділі.

| # | Ситуація (2-й контур) | Mock / примітка | Лекції для наповнення (`stableId`) |

| 3.1 | Права працівника на охорону праці (при укладенні договору і під час роботи) | Закон ст. 5–6 | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2`; `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.2 | Право відмовитися від виконання небезпечної роботи | | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2`; `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.3 | Пільги і компенсації за важкі та шкідливі умови праці | Закон ст. 7 | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2`; `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.4 | Обов’язки роботодавця з охорони праці | Повний шар; підготовка до допуску — також 1.8 | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` (ст. 13); `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.5 | Обов’язки працівника з охорони праці | Повний шар; підготовка — також 1.9 | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` (ст. 14); `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.6 | Служба охорони праці на підприємстві | Закон ст. 15 | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2`; `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.7 | Гарантії з охорони праці при укладенні, зміні та припиненні трудового договору | | `pravove-rehuliuvannia-trudovykh-vidnosyn`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 3.8 | Відсторонення від роботи з підстав охорони праці / стану здоров’я | | `pravove-rehuliuvannia-trudovykh-vidnosyn`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 3.9 | Умови охорони праці в колективному договорі | | `pravove-rehuliuvannia-trudovykh-vidnosyn`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 3.10 | Участь працівників і профспілки в питаннях охорони праці | | `pravove-rehuliuvannia-trudovykh-vidnosyn`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 3.11 | Державний нагляд і контроль у сфері охорони праці | | `pravove-rehuliuvannia-trudovykh-vidnosyn`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2`; далі `ekspertyza-u-sferi-tsyvilnoi-bezpeky-ta-okhorony-pratsi-1-14` |
| 3.12 | Відповідальність за порушення вимог охорони праці | Закон ст. 44 тощо | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2`; `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.13 | Праця неповнолітніх: обмеження, гарантії, охорона праці | Затверджено окремо | `pravove-rehuliuvannia-trudovykh-vidnosyn`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 3.14 | Поняття трудових правовідносин і сторони | База трудового права | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.15 | Джерела трудового права | Конституція, КЗпП, закони, підзаконні, локальні, міжнародні | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.16 | Рівність трудових прав і заборона дискримінації | | `pravove-rehuliuvannia-trudovykh-vidnosyn`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 3.17 | Укладення трудового договору | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.18 | Зміна умов трудового договору та переведення | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.19 | Припинення трудового договору та звільнення | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.20 | Фактичний допуск до роботи без оформлення трудового договору | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.21 | Колективні угоди та колективні договори | Ширший шар, ніж лише ОП у 3.9 | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.22 | Робочий час | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.23 | Час відпочинку та відпустки | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.24 | Оплата праці: гарантії та обмеження | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.25 | Дисципліна праці | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.26 | Матеріальна відповідальність сторін трудового договору | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.27 | Дистанційна та надомна робота | У т.ч. інструктажі/ОП на дистанції — посилання на 1.1 | `pravove-rehuliuvannia-trudovykh-vidnosyn`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 3.28 | Праця жінок та осіб із сімейними обов’язками: гарантії | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.29 | Праця осіб з інвалідністю: гарантії та квоти | | `pravove-rehuliuvannia-trudovykh-vidnosyn`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 3.30 | Право на зайнятість і статус безробітного | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.31 | Соціальне страхування від нещасного випадку: права застрахованих | Процес розслідування — розділ 9; тут права/гарантії | `pravove-rehuliuvannia-trudovykh-vidnosyn`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |
| 3.32 | Трудові спори та захист трудових прав | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |
| 3.33 | Міжнародні стандарти та акти МОП у трудовому праві | | `pravove-rehuliuvannia-trudovykh-vidnosyn` |

**Примітка:** список можна далі дробити (напр. окремі підстави звільнення) — це очікувано для довідника. Алгоритми медоглядів/інструктажів/розслідування як процес лишаються в інших розділах; тут — права, обов’язки, гарантії, відповідальність.

## 4. Умови праці та фактори `working_conditions`

Статус 2-го контуру: **затверджено (розширений каркас)**.  
2-й контур можна дробити за факторами (довідник). **3-й контур — компактний Q&A**: норми/вимірювання/заходи/коли ЗІЗ — без простинь у одному підрозділі.  
Документи атестації — також у 2.17; ЗІЗ як видача — розділ 5.

| # | Ситуація (2-й контур) | Mock / примітка | Лекції для наповнення (`stableId`) |

| 4.1 | Гігієна та фізіологія праці: основні терміни і призначення | База розділу | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `vyrobnycha-sanitariia-i-hihiiena-pratsi` |
| 4.2 | Класифікація шкідливих і небезпечних виробничих факторів | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `vyrobnycha-sanitariia-i-hihiiena-pratsi`; `hihiienichne-normuvannia-umov-pratsi-ta-stanu-dovkillia-lektsiia-1-8` |
| 4.3 | Гігієнічні нормативи умов праці | | `hihiienichne-normuvannia-umov-pratsi-ta-stanu-dovkillia-lektsiia-1-8`; `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` |
| 4.4 | Мікроклімат виробничих приміщень | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `vyrobnycha-sanitariia-i-hihiiena-pratsi` |
| 4.5 | Повітря робочої зони: хімічні речовини та пил | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` (нормативи повітря); `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` (пил) |
| 4.6 | Вентиляція виробничих приміщень | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `vyrobnycha-sanitariia-i-hihiiena-pratsi` |
| 4.7 | Освітлення робочих місць (природне та штучне) | Частково вже в `sit-6` | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` (ДБН освітлення) |
| 4.8 | Шум на виробництві: нормування, контроль, захист | Розвести з `sit-12` (зараз шум+вібрація разом) | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `vyrobnycha-sanitariia-i-hihiiena-pratsi` |
| 4.9 | Вібрація: нормування, контроль, захист | Див. `sit-12` | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `vyrobnycha-sanitariia-i-hihiiena-pratsi` |
| 4.10 | Ультразвук та інфразвук | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` |
| 4.11 | Неіонізуючі випромінювання (УФ, ІЧ, електромагнітні) | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` |
| 4.12 | Лазерне випромінювання | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` |
| 4.13 | Іонізуючі випромінювання на робочому місці | Радіаційний ЦЗ-контур — також розділ 11 | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; частково `tsyvilnyi-zakhyst-ta-radiatsiina-bezpeka` |
| 4.14 | Біологічні фактори виробничого середовища | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `vyrobnycha-sanitariia-i-hihiiena-pratsi` |
| 4.15 | Важкість праці | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` |
| 4.16 | Напруженість праці | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` |
| 4.17 | Ергономіка робочого місця (у т.ч. офіс / ПЕОМ) | Відповідь на «як полегшити працю»; частково санітарія | `erhonom1ka`; `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` |
| 4.18 | Антропометричні вимоги до обладнання та робочого місця | З лекції з ергономіки | `erhonom1ka` |
| 4.19 | Ергономічна оцінка ручного інструменту та оснастки | З лекції з ергономіки (показники, чеклісти) | `erhonom1ka` |
| 4.20 | Комплексна ергономічна оцінка / ергономічний ризик | Алгоритми оцінки з `erhonom1ka` | `erhonom1ka`; частково `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1` |
| 4.21 | Режими праці, перерви та зниження втоми (ергономіка організації праці) | | `erhonom1ka`; `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` |
| 4.22 | Атестація / оцінка умов праці на робочих місцях | Є ядро: `sit-6`; документи — 2.17 | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` (тема 7); `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 4.23 | Карта умов праці: читання та застосування | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `vyrobnycha-sanitariia-i-hihiiena-pratsi` |
| 4.24 | Класи умов праці за гігієнічною класифікацією | | `hihiienichne-normuvannia-umov-pratsi-ta-stanu-dovkillia-lektsiia-1-8`; `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` |
| 4.25 | Лабораторні вимірювання та санітарно-гігієнічні дослідження факторів | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `hihiienichne-normuvannia-umov-pratsi-ta-stanu-dovkillia-lektsiia-1-8` |
| 4.26 | Заходи з поліпшення умов праці за результатами оцінки | | `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18`; `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2`; `erhonom1ka` |
| 4.27 | Гігієнічне нормування і стан довкілля (межа з екологією) | Дубль/посилання з розділом 13 ок | `hihiienichne-normuvannia-umov-pratsi-ta-stanu-dovkillia-lektsiia-1-8`; `ekolohichni-ryzyky-ta-vplyv-tekhnohennykh-system-na-dovkillia` |

**Межі:** видача ЗІЗ і картки обліку — розділи 5 і 2; пільги/компенсації за умови — 3.3; радіація як ЦЗ/аварія — розділ 11 (тут — фактор на робочому місці).  
**Ергономіка:** лекція `erhonom1ka` (~500 стор., переважно наукові матеріали) годує **4.17–4.21** і частково 4.26; 3-й контур лишається Q&A, без переносу цілих статей.

## 5. ЗІЗ та колективний захист `ppe_protection`

Статус 2-го контуру: **затверджено (каркас)**.  
Процес забезпечення + види ЗІЗ/ЗКЗ. Картки/норми як документи — також 2.11–2.12. Ергономіка підбору — посилання на 4.18.  
3-й контур: Q&A (коли видавати / який клас / хто підписує / заміна) — без простинь стандартів.

| # | Ситуація (2-й контур) | Mock / примітка | Лекції для наповнення (`stableId`) |
|---:|---|---|---|
| 5.1 | Забезпечення працівників ЗІЗ: норми, видача, облік | Є: `sit-5` | `zasoby-indyvidualnoho-zakhystu`; `syz`; `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |
| 5.2 | Підбір ЗІЗ за шкідливим / небезпечним фактором | | `zasoby-indyvidualnoho-zakhystu`; `syz`; `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` |
| 5.3 | Захист голови (каски, шоломи) | | `zasoby-indyvidualnoho-zakhystu`; `syz` |
| 5.4 | Захист очей та обличчя | | `zasoby-indyvidualnoho-zakhystu`; `syz` |
| 5.5 | Захист органів слуху | | `zasoby-indyvidualnoho-zakhystu`; `syz`; `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` |
| 5.6 | Захист органів дихання (респіратори, протигази тощо) | | `zasoby-indyvidualnoho-zakhystu`; `syz` |
| 5.7 | Спецодяг і захист шкіри / рук | | `zasoby-indyvidualnoho-zakhystu`; `syz`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |
| 5.8 | Спецвзуття | | `zasoby-indyvidualnoho-zakhystu`; `syz` |
| 5.9 | ЗІЗ від падіння з висоти (прив’язі, стропи, анкери — як ЗІЗ) | Системна організація робіт на висоті — також 6.x | `zasoby-indyvidualnoho-zakhystu`; `syz`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |
| 5.10 | Приймання, сертифікація / відповідність ЗІЗ вимогам | | `zasoby-indyvidualnoho-zakhystu`; `syz` |
| 5.11 | Експлуатація, догляд, прання, ремонт і заміна ЗІЗ | | `zasoby-indyvidualnoho-zakhystu`; `syz` |
| 5.12 | Контроль застосування ЗІЗ на робочому місці | | `zasoby-indyvidualnoho-zakhystu`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 5.13 | Засоби колективного захисту (ЗКЗ): огорожі, вентиляція, блокування тощо | Частково вже в `sit-9` | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1`; `zasoby-indyvidualnoho-zakhystu`; `beims-l-1-16` |
| 5.14 | Знаки безпеки, сигналізація та розмітка зон | | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |

**Межі:** журнали/картки — розділ 2; ергономіка інструменту — 4.19; наряд на висоту — 1.7 / 6.x.

## 6. Небезпечні роботи та устаткування `hazardous_work`

Статус 2-го контуру: **затверджено (каркас)**.  
Дубль наряду-допуску з 1.7 / 2.14 — ок. Пожежа/вибух як окрема полиця — розділ 12 (тут — вогневі роботи як вид робіт).  
3-й контур: Q&A (хто допускає / які заборони / які ЗІЗ / аварійна дія).

| # | Ситуація (2-й контур) | Mock / примітка | Лекції для наповнення (`stableId`) |
|---:|---|---|---|
| 6.1 | Роботи з підвищеною небезпекою: загальний порядок організації | Перелік робіт — з НПАОП/лекцій | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2`; `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` |
| 6.2 | Наряд-допуск на роботи підвищеної небезпеки | Дубль 1.7 / 2.14; база `sit-2` | `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 6.3 | Роботи на висоті | Є: `sit-2` | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1`; `zasoby-indyvidualnoho-zakhystu` |
| 6.4 | Вантажопідіймальні роботи та крани / механізми | | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 6.5 | Навантажувачі та навантажувально-розвантажувальні роботи | Є: `sit-8` | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 6.6 | Електробезпека устаткування та електричних мереж | Є: `sit-15` | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1`; `beims-l-1-16` |
| 6.7 | Безпека експлуатації інженерних мереж і споруд (БЕІМС) | | `beims-l-1-16` |
| 6.8 | Газонебезпечні роботи та роботи в замкнених просторах | | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1`; `beims-l-1-16`; далі уточнити з корпусу |
| 6.9 | Вогневі та зварювальні роботи | Стик з розділом 12 | `pozhezhna-ta-vybukhova-bezpeka-1-9`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |
| 6.10 | Земляні роботи та роботи в траншеях / котлованах | | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1`; далі уточнити |
| 6.11 | Роботи з інструментом підвищеної небезпеки (у т.ч. ручним/електро) | Стик з ергономікою 4.19 | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1`; `erhonom1ka` |
| 6.12 | Технологічні процеси та устаткування металургійних виробництв | Галузева полиця з лекції | `tekhnolohichni-protsesy-ta-ustatkuvannia-metalurhiinykh-pidpryiemstv`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |
| 6.13 | Технічне обслуговування, ремонт і випробування устаткування | | `beims-l-1-16`; `tekhnolohichni-protsesy-ta-ustatkuvannia-metalurhiinykh-pidpryiemstv`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |
| 6.14 | Блокування / маркування енергії (LOTO) та безпечне відключення | Кандидат; уточнити наявність у extract | `beims-l-1-16`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |
| 6.15 | Огляд, дефектація та виведення з експлуатації небезпечного устаткування | | `beims-l-1-16`; `tekhnolohichni-protsesy-ta-ustatkuvannia-metalurhiinykh-pidpryiemstv` |

**Межі:** I група електробезпеки персоналу — 1.3; пожежна система об’єкта — розділ 12; аварійне реагування — розділ 8.

## 7. Ризики, моніторинг, прогнозування `risk_monitoring`

Статус 2-го контуру: **затверджено (каркас)**.  
Ядро: `sit-9`. Ергономічний ризик — дубль/посилання на 4.20. Прогнозування НС — стик з розділами 8 і 11.  
3-й контур: Q&A (що ідентифікувати / як оцінити / хто затверджує реєстр / як моніторити).

| # | Ситуація (2-й контур) | Mock / примітка | Лекції для наповнення (`stableId`) |
|---:|---|---|---|
| 7.1 | Ідентифікація небезпек на робочих місцях і в процесах | Частина `sit-9` | `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 7.2 | Оцінка професійних ризиків (методика та рівні) | Є ядро: `sit-9` | `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 7.3 | Ризик-орієнтований підхід у системі управління ОП | | `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1` |
| 7.4 | Реєстр небезпек і карта / матриця ризиків | Бланк-родич у forms | `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1`; `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` |
| 7.5 | Заходи зі зниження ризиків і контроль залишковості | | `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |
| 7.6 | Моніторинг ефективності заходів з ОП / ризиків | | `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1`; `bezpeka-obiektiv-ta-terytorii` |
| 7.7 | Моніторинг загроз надзвичайних ситуацій | З лекції 1 / НС | `bezpeka-obiektiv-ta-terytorii`; `bezpeka-ta-tekhnohennyi-ryzyk-v-nadzvychainykh-sytuatsiiakh` |
| 7.8 | Прогнозування НС техногенного характеру | Частина `sit-9` | `bezpeka-obiektiv-ta-terytorii`; `bezpeka-ta-tekhnohennyi-ryzyk-v-nadzvychainykh-sytuatsiiakh` |
| 7.9 | Прогнозування природних небезпек | Частина `sit-9` | `bezpeka-obiektiv-ta-terytorii`; `bezpeka-ta-tekhnohennyi-ryzyk-v-nadzvychainykh-sytuatsiiakh` |
| 7.10 | Оцінка ризику для об’єктів підвищеної небезпеки (ОПН) | Стик з розділом 11 | `bezpeka-obiektiv-ta-terytorii`; `bezpeka-ta-tekhnohennyi-ryzyk-v-nadzvychainykh-sytuatsiiakh` |
| 7.11 | Ергономічний ризик: ідентифікація та оцінка | Дубль/посилання на 4.20 | `erhonom1ka`; `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1` |
| 7.12 | Виробничі ризики окремих процесів (падіння предметів, транспорт тощо) | Точкові кейси з БП | `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |
| 7.13 | Інформування працівників про ризики на робочому місці | | `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` |
| 7.14 | Перегляд оцінки ризиків після змін / інцидентів | | `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1`; `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` |

**Межі:** реагування на НС — розділ 8; ідентифікація ОПН / ПЛЛА як документи й ЦЗ — розділ 11; гігієнічні фактори як такі — розділ 4.

## 8. Реагування при НС та аваріях `emergency_response`

_(2-й контур — TBD)_

## 9. Нещасні випадки та розслідування `accident_investigation`

_(2-й контур — TBD)_

## 10. Перша допомога `first_aid`

_(2-й контур — TBD; також модуль `/first-aid`)_

## 11. Цивільний захист та ОПН `civil_protection`

_(2-й контур — TBD)_

## 12. Пожежна та вибухова безпека `fire_explosion`

_(2-й контур — TBD)_

## 13. Екологічні ризики на виробництві `ecology`

_(2-й контур — TBD)_

## 14. Психологія безпеки та поведінка `psychology_behavior`

_(2-й контур — TBD)_

---

## Легенда лекцій (швидкий індекс)

| stableId | Файл |
|---|---|
| `bezpeka-obiektiv-ta-terytorii` | Безпека обєктів та територій.pdf |
| `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-1` | Безпека праці та виробничих процесів_1.pdf |
| `bezpeka-pratsi-ta-vyrobnychykh-protsesiv-2` | Безпека праці та виробничих процесів_2.pdf |
| `vedennia-dokumentatsii-ta-navchannia-z-okhorony-pratsi` | Ведення документації та навчання з охорони праці.pdf |
| `pravove-rehuliuvannia-trudovykh-vidnosyn` | Правове регулювання трудових відносин.pdf |
| `beims-l-1-16` | БЕІМС_Л_1-16.pdf |
| `zasoby-indyvidualnoho-zakhystu` | Засоби індивідуального захисту.pdf |
| `syz` | СИЗ.pdf |
| `ekspertyza-u-sferi-tsyvilnoi-bezpeky-ta-okhorony-pratsi-1-14` | Експертиза у сфері цивільної безпеки та охорони праці 1-14.pdf |
| `vyrobnycha-sanitariia-i-hihiiena-pratsi-1-18` | Виробнича санітарія і гігієна праці 1-18.pdf |
| `vyrobnycha-sanitariia-i-hihiiena-pratsi` | Виробнича санітарія і гігієна праці.pdf |
| `hihiienichne-normuvannia-umov-pratsi-ta-stanu-dovkillia-lektsiia-1-8` | Гігієнічне нормування умов праці та стану довкілля Лекція_1-8.pdf |
| `erhonom1ka` | Ергоном1ка.pdf |
| `ryzyk-oriientovanyi-pidkhid-do-bezpeky-pratsi-9-1` | Ризик-орієнтований підхід до безпеки праці 9_1.pdf |
| `ekolohichni-ryzyky-ta-vplyv-tekhnohennykh-system-na-dovkillia` | Екологічні ризики та вплив техногенних систем на довкілля.pdf |
| `tsyvilnyi-zakhyst-ta-radiatsiina-bezpeka` | Цивільний захист та радіаційна безпека.pdf |
| `bezpeka-ta-tekhnohennyi-ryzyk-v-nadzvychainykh-sytuatsiiakh` | Безпека та техногенний ризик в надзвичайних ситуаціях.pdf |
| `pozhezhna-ta-vybukhova-bezpeka-1-9` | Пожежна та вибухова безпека 1-9.pdf |
| `tekhnolohichni-protsesy-ta-ustatkuvannia-metalurhiinykh-pidpryiemstv` | Технологічні процеси та устаткування металургійних підприємств.pdf |

Повний реєстр: `_queue.json`.
