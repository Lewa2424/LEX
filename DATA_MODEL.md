# DATA_MODEL — модель даних LEX

## Статус

**Partial.** Початкову PostgreSQL-схему описано в `supabase/migrations/20260809000000_init_lex_schema.sql`. Міграція локально не застосована та RLS не перевірена integration-тестами.

## Інваріанти

- Офіційний текст зберігається у `source_fragments`, редакційне пояснення — окремо.
- Кожна `citation` посилається на fragment конкретної незмінної `legal_source_version`.
- Нову редакцію джерела додають новим записом; попередню не перезаписують.
- Єдиний lifecycle: `draft → under_review → published → needs_review → archived`, з `rejected`.
- Draft/rejected доступні лише редакційним ролям; UI-gate не замінює RLS.
- Медичні матеріали починаються зі статусу `draft`.

## Стартовий корпус (Planned / Blocked)

Власник має обрати малий корпус, після чого людина-редактор перевіряє офіційний домен, чинність, редакцію, дату, права на зберігання та точність кожної цитати. Мінімум для вертикального slice за ТЗ: 3 джерела, 10 цитат і 10 термінів. У seed є лише нейтральні draft-плейсхолдери; вони не виконують цю вимогу.

Заборонено переносити номери, дати або формулювання з mock/TZ як підтверджені норми.

## Таблиці

Схема містить sources/versions/fragments/citations, situations/phases/sections, terms, learning, forms/files, first aid, categories/relations, profiles/favorites/reports, audit, ingestion та public settings. Зв’язки й обмеження див. у міграції.
