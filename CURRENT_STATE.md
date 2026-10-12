# CURRENT_STATE — фактический статус LEX

**Дата:** 2026-08-09  
**Язык продукта (UI):** украинский  
**Режим данных по умолчанию:** `mock` (`VITE_DATA_MODE`)

## Implemented

- React 19 + TypeScript + Vite 6 + Tailwind CSS 4 frontend-витрина.
- Довідник містить 17 предметно-практичних розділів: розділ → підрозділ → ситуація → довільні блоки відповіді. Документи та перша допомога винесені у власні модулі, щоб не дублювати матеріали.
- Фіксовані шість етапів прибрано з публічної моделі; порожні етапи не показуються і не вимагаються.
- Джерела лекцій залишаються внутрішнім редакційним шаром і не показуються на сторінці відповіді.
- Маршруты пользователя (каталоги/детали: reference, learning, forms, terms, search, favorites, profile, first-aid).
- Admin-маршруты `/admin/*` (локальный mock workflow).
- AppShell, тема light/dark, ErrorBoundary, lazy routes.
- Mock-сервисы и демонстрационные данные (`src/mocks`).
- `ServiceProvider` / `useServices()`, `QueryProvider`, `AuthProvider` (mock).
- Zod env (`src/shared/config/env.ts`), `AppError`.
- Vitest unit tests; Playwright e2e smoke для `/`.
- ESLint + Prettier конфиги.
- `ServiceProvider` використовується публічними модулями; лексичний adapter обгортає mock search.
- Локальні admin-маршрути для джерел, цитат, термінів, ситуацій, форм, навчання та first aid.
- Mock AuthProvider, in-memory content reports і domain contracts ролей/статусів.
- Локальна Supabase schema/seed scaffold без реальних ключів або перевіреного корпусу.
- Storage і semantic search interfaces/stubs; semantic search явно вимкнено.
- Публічний first-aid показує лише `published` (зараз порожньо — drafts у admin).
- Украинский UI и украинский mock-контент на экране.
- Документація ТЗ + CURRENT_STATE / DATA_MODEL / SECURITY / DEPLOYMENT / тощо.

## Partial

- Supabase repositories: контракти та явні `NOT_CONFIGURED` stubs без реального CRUD.
- Избранное: только `localStorage` (гость), без серверной синхронизации.
- Отчёт об ошибке: UI-форма записує лише до in-memory mock store.
- Скачивание бланков: кнопки без реального Storage.
- Первая помощь: структурные карточки мають `draft`, без проверенных медицинских алгоритмов.
- Admin gate: лише візуальна перевірка `localStorage.lex_role`; server-side захист не підключено.
- RLS: SQL policies написані, але міграцію не застосовано й role tests не виконано.
- Alias `@` указывает на **корень проекта**, не на `src`.

## Planned

- Реальний Supabase CRUD/Auth/Storage, server-side publication RPC та audit automation.
- PostgreSQL лексичний пошук; semantic search — лише після окремого погодження.
- Повний admin/editor workflow з валідацією, preview/diff та rollback.
- Production deploy / backup rehearsal.

## Blocked

- Удалённый Supabase-проект и реальные ключи — до команды владельца.
- Публикация реальных НПА/цитат — до человеческой проверки официальных источников.
- Медицинский контент first-aid — до утверждения редакционной ответственности.
- Production deployment — до отдельного разрешения.

## Расхождения с ранней документацией

- `package.json` имя: `lex` (раньше `react-example`).
- Gemini capability из `metadata.json` удалена (не используется).
- Служебные баннеры «Етап 1 / Cursor AI» убраны из UI.
- README/ARCHITECTURE/MOCKS синхронизируются с этим файлом; будущие функции не описываются как уже работающие.
