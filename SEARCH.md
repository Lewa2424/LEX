# SEARCH

## Implemented

- `LexicalSearchAdapter` обгортає чинний mock-пошук.
- Пошукові сторінки отримують сервіс через `ServiceProvider`.
- URL зберігає основний параметр `q`; mock підтримує фільтри та сортування.

## Planned

PostgreSQL full-text search, trigram/prefix matching, нормалізація українських запитів і номерів документів, server pagination, cancellation та пояснюване ранжування. Пошук має повертати гостю лише опублікований корпус.

## Semantic search — Blocked

`SemanticSearchAdapter` є вимкненою заглушкою (`NOT_ENABLED`). Embeddings, провайдер, індексація та hybrid ranking не реалізуються до приймання лексичного пошуку, вимірювання якості/вартості та окремого погодження власника.
