# ROUTES.md — Карта маршрутов и навигации LEX

Реестр всех публичных маршрутов приложения. Маршруты декларируются в `src/app/routes/routeRegistry.ts`.

| Маршрут | Компонент | Описание страницы |
| :--- | :--- | :--- |
| `/` | `HomePage` | Главная страница: витрина, быстрый поиск, категории ситуаций, обновления |
| `/search` | `SearchPage` | Поисковая выдача с фильтрами по типам материалов, категориям и статусам |
| `/reference` | `ReferenceCatalogPage` | Каталог: 19 разделов → подразделы → рабочие ситуации |
| `/reference/:slug` | `SituationDetailPage` | Краткий структурированный ответ с произвольным числом смысловых блоков |
| `/learning` | `LearningCatalogPage` | Каталог учебных направлений и курсов самоподготовки |
| `/learning/:slug` | `TopicDetailPage` | Учебный материал с разделами, цитатами и кейсами для самопроверки |
| `/first-aid` | `FirstAidPage` | Алгоритмы первой помощи на производстве, категории и предупреждения |
| `/forms` | `FormsCatalogPage` | Каталог бланков, журналов и шаблонов документов |
| `/forms/:slug` | `FormDetailPage` | Детальный просмотр бланка, требования, сроки и скачивание |
| `/terms` | `TermsCatalogPage` | Алфавитный глоссарий терминов по охране труда |
| `/terms/:slug` | `TermDetailPage` | Официальное определение термина, редакторское пояснение и НПА |
| `/favorites` | `FavoritesPage` | Сохранённые пользователем материалы с локальным хранением в localStorage |
| `/profile` | `ProfilePage` | Профиль пользователя и настройки интерфейса |
| `/admin` | `AdminLayout` | Локальна редакційна панель; visual gate за `localStorage.lex_role` |
| `/admin/sources` | `AdminSourcesPage` | Mock CRUD джерел і workflow |
| `/admin/terms` | `AdminTermsPage` | Mock CRUD термінів і workflow |
| `/admin/citations` | `AdminCitationsPage` | Mock CRUD цитат і workflow |
| `/admin/situations` | `AdminSituationsPage` | Перелік mock-ситуацій |
| `/admin/situations/:slug` | `AdminSituationDetailPage` | Локальний редактор шести етапів і citation picker |
| `/admin/forms` | `AdminFormsPage` | Mock metadata версій файлів |
| `/admin/learning` | `AdminLearningPage` | Mock CRUD навчальних матеріалів |
| `/admin/first-aid` | `AdminFirstAidPage` | Draft-only контур домедичної допомоги |
| `*` | `NotFoundPage` | Экран 404 для ненайденных страниц |

Admin gate не є авторизацією. Після підключення backend доступ має примусово перевірятися RLS/server-side.
