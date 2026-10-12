# CHANGELOG

## 2026-08-09 — Этапы 0–9 (каркас по ТЗ)

### Этап 0 — стабилизация

- `package.json` → `lex@0.1.0`
- убрана ложная Gemini capability из `metadata.json`
- безопасный `.env.example`, исправлена кодировка `vite.config.ts`
- добавлены `CURRENT_STATE.md`, обновлены README / ARCHITECTURE / MOCKS
- усилен `.gitignore`

### Этап 1 — инфраструктура

- Zod env, `AppError`, `QueryProvider`, `ServiceProvider` + `useServices()`
- UI без прямых импортов mock-сервисов
- ESLint, Prettier, Vitest, Playwright config

### Этапы 2–9 — scaffolding

- локальная Supabase schema/seed и базовые RLS policies;
- domain contracts, repositories, storage и search adapters;
- mock Auth, reports и favorites sync boundary;
- локальная admin-панель для основных типов контента;
- first-aid публично показывает только `published` (сейчас пусто / draft в admin);
- semantic search stub (`NOT_ENABLED`);
- документация readiness и ADR.

### Not delivered / Blocked

Remote backend, verified legal/medical corpus, реальный OAuth, Storage uploads, semantic search, deploy, backup rehearsal и production security guarantees — до решений владельца.
