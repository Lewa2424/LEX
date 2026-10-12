# CODE_MAP — Salus

## Призначення

Українськомовний довідник з охорони праці: 19 сфер, тематичні підрозділи, робочі ситуації з готовими відповідями, бланки та терміни.

## Архітектурні потоки

- UI: `src/main.tsx` → `src/app/*` → `src/modules/*` → `useServices()` → `src/mocks/services/*` → `src/mocks/data/*`.
- Довідник: `/reference` — розділи → підрозділи → ситуації; `/reference/:slug` — довільні змістовні блоки відповіді.
- Пошук: `/search` → `SearchService`.
- Наповнення з лекцій (офлайн): `development data/Lessons` → extract → `development data/lecture-work` → mock-ситуації.

## Директорії

| Шлях | Роль |
|---|---|
| `src/app` | Провайдери, shell, маршрути |
| `src/modules` | Екрани сценаріїв |
| `src/domain` | Чиста предметна конфігурація (напр. розділи) |
| `src/shared` | types, ui, lib |
| `src/mocks` | Дані та сервіси вітрини |
| `development data` | Лекції, extract, lecture-work |
| `.cursor/rules` | Правила агента під Salus |

## Точки входу

- Клієнт: `src/main.tsx`
- Маршрути: `src/app/routes/routeRegistry.ts`
- Сервіси UI: `src/app/providers/ServiceProvider.tsx`

## Джерела істини

- Типи: `src/shared/types/index.ts`
- Розділи 1-го контуру: `src/domain/referenceSections.ts`
- Ситуації: `src/mocks/data/situationsData.ts` (+ секційні файли `safetyManagementSituations.ts`, `rightsRelationsSituations.ts`, `workerAdmissionSituations.ts`, `hazardsRisksSituations.ts`, `workEnvironmentSituations.ts`, `occupationalHealthSituations.ts`, `protectiveEquipmentSituations.ts`, `equipmentSystemsSituations.ts`, `highRiskWorkSituations.ts`, `technologyProcessesSituations.ts`, `fireExplosionSituations.ts`, `emergenciesSituations.ts`, `civilProtectionSituations.ts`, `incidentsInvestigationSituations.ts`, `environmentalSafetySituations.ts`, `ergonomicsSituations.ts`, `auditImprovementSituations.ts`)
- Облік лекцій: `development data/lecture-work/`
- Дерево 1–2 контурів (редакційне): `development data/lecture-work/HIERARCHY.md`
- Дизайн: `DESIGN_SYSTEM.md`, `src/index.css`, `src/shared/ui/*`

## Публічні контракти

- Маршрути `/reference`, `/reference/:slug`, `/search`, …
- `ReferenceSectionId`, `ReferenceTopic`, `ReferenceSituation`, `SituationAnswerBlock`
- Статуси `VerificationStatus`
- `IReferenceService.getSections` / `getSituations` / `getSituationBySlug`

## Критичні інваріанти

- Розділи й підрозділи організовані за питаннями користувача, не за лекціями; порожні етапи не створюються.
- Архів лекції ≠ verified НПА без людської перевірки.
- UI не імпортує інстанси сервісів в обхід `useServices`.
