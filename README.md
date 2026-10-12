# Salus — пошуково-довідкова система з охорони праці

Фронтенд-платформа (React 19 + TypeScript + Tailwind CSS 4) для пошуку нормативних вимог, робочих ситуацій, навчальних матеріалів, бланків і термінів.

**Статус:** каркас вітрини на mock-даних. Фактичний стан — у [CURRENT_STATE.md](./CURRENT_STATE.md). Контракт розробки — у `development data/TZ_LEX_CURSOR.md`.

## Вимоги

- Node.js >= 20.x
- npm >= 10.x

## Запуск

```bash
npm install
cp .env.example .env
npm run dev
```

Додаток: `http://localhost:3000`.

```bash
npm run build    # production-збірка
npm run lint     # tsc --noEmit
npm run test     # unit/integration (Vitest)
npm run test:e2e # Playwright (після встановлення браузерів)
```

## Архітектура (коротко)

- `src/app` — shell, маршрути, провайдери
- `src/modules` — екрани фіч
- `src/shared` — UI та спільні типи
- `src/mocks` — демонстраційні дані та сервіси
- `src/domain` / `src/infrastructure` — доменні контракти та адаптери (етапи ТЗ)
- `supabase` — SQL-міграції (локально / після підключення backend)

## Документація

| Файл | Призначення |
|---|---|
| [CURRENT_STATE.md](./CURRENT_STATE.md) | Що реально працює зараз |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Структура та межі |
| [ROUTES.md](./ROUTES.md) | Маршрути |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | UI / a11y |
| [MOCKS.md](./MOCKS.md) | Mock-шар |
| [DATA_MODEL.md](./DATA_MODEL.md) | Модель даних |
| [SECURITY.md](./SECURITY.md) | Безпека |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Розгортання |

## Важливо

- UI мова: **українська**.
- Не вигадувати нормативні вимоги та цитати.
- Секрети не зберігаються в репозиторії; див. `.env.example`.
