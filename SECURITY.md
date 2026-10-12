# SECURITY

## Partial

- У міграції ввімкнено RLS і додано базові public/editorial/own-record policies.
- `profiles.role` — цільове server-side джерело ролі; зміну колонки відкликано для `authenticated`.
- Client використовує лише anon key; service-role key заборонено у Vite/env bundle.
- Admin `localStorage.lex_role` — виключно візуальна локальна демонстрація, не механізм безпеки.

## Не перевірено

Міграцію не застосовано; немає role/RLS integration-тестів, publication RPC, rate limit, file validation, CSP/headers, SSRF allowlist, OAuth redirect validation чи security review.

До production потрібні окремі server-side функції публікації й ролей, тести guest/editor/reviewer/admin, spam-захист reports, обмеження файлів та аудит секретів.
