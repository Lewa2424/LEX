# DEPLOYMENT

## Implemented locally

- Vite build;
- `VITE_DATA_MODE=mock` за замовчуванням;
- null-safe Supabase client;
- локальний `supabase/config.toml`.

## Planned

1. Власник обирає hosting, Supabase organization/project і домени.
2. Preview отримує окремі public env values та OAuth redirects.
3. Міграції застосовуються спочатку до тестового середовища.
4. Виконуються RLS, smoke, accessibility і restore checks.
5. Production deploy та rollback виконуються лише за окремим дозволом.

Віддалений Supabase-проєкт, реальні ключі, preview і production deployment не створені.
