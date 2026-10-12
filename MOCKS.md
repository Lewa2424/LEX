# MOCKS.md — шар демонстраційних даних

**Статус:** Implemented для локальної вітрини.

## Дані (`src/mocks/data/`)

Усі тексти — нейтральні демонстраційні структури українською. Вони **не є** підтвердженими офіційними цитатами НПА.

Файли: `situationsData`, `sourcesData`, `formsData`, `learningData`, `firstAidData`, `termsData`, `searchData`.

## Сервіси

Доступ через `ServiceProvider` / `useServices()` (етап інфраструктури). Прямий імпорт інстансів з UI — заборонений після міграції.

Сценарії (`mockScenarioManager`):

- `normal` — ~150 мс
- `slow` — ~1500 мс
- `empty` — порожні відповіді
- `error` — виняток для ErrorBoundary

URL: `?mockScenario=slow` або `services.setScenario('slow')`.

## Правило

Mock-статуси (`verified` тощо) у демо-даних **не** вважаються доказом редакційної перевірки в production-сенсі. Для реального корпусу використовується lifecycle з DATA_MODEL / EDITORIAL_WORKFLOW.
