# ARCHITECTURE.md — архітектурний огляд LEX

**Статус документа:** відповідає CURRENT_STATE (каркас + етапна розбудова за ТЗ).

## 1. Структура каталогів

```
src/
├── app/                  # ядро: shell, routes, providers, orchestrator
├── modules/              # фічі / екрани (home, search, reference, …, admin)
├── domain/               # доменні типи, політики статусів, контракти сервісів
├── infrastructure/       # supabase client, repositories, storage, monitoring adapters
├── mocks/                # demo data + mock repositories/services
├── shared/               # UI, lib, config, errors
└── test/                 # setup тестів
supabase/
└── migrations/           # SQL схема та RLS
```

## 2. Потік даних (цільовий)

```
Page / Component
  → Feature hook / use case
  → Domain service interface (via ServiceProvider)
  → Mock repository  OR  Supabase repository
  → PostgreSQL / Storage / Edge Function
```

UI не звертається до таблиць Supabase напряму.

## 2.1. Ієрархія довідника

```
Розділ (19 канонічних сфер)
  → Підрозділ (група питань)
    → Ситуація (конкретне питання користувача)
      → Довільні змістовні блоки відповіді
```

Кількість блоків визначається наявним змістом. Фіксованих етапів і публічного відображення джерел немає.

## 3. Режими даних

- `VITE_DATA_MODE=mock` (за замовчуванням) — локальні сервіси з сценаріями normal/slow/empty/error.
- `VITE_DATA_MODE=supabase` — репозиторії через Supabase (після конфігурації ключів власником).

## 4. Ролі (план / backend)

`guest` | `user` | `editor` | `reviewer` | `admin` (+ medical reviewer для first-aid).

Права перевіряються RLS / server-side; приховування кнопок у UI не є захистом.

## 5. Alias `@`

Вказує на **корінь проєкту** (`@/src/...`, `@/supabase/...`). Зміна на `src` потребує окремого ADR і міграції імпортів.

## 6. Що не входить у поточну вітрину

- Автономні юридичні відповіді ШІ
- Автопублікація scraped-змін законодавства
- Повноцінна LMS / білінг / мобільний native додаток
