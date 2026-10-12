/**
 * @fileoverview Общие типы данных и доменные интерфейсы платформы LEX.
 * Содержит типы для НПА, цитат, рабочих ситуаций, учебных тем, бланков, терминов и поиска.
 */

/** Статусы проверки и актуальности нормативных материалов. */
export type VerificationStatus = 'verified' | 'updated' | 'archived' | 'draft' | 'under_review';

/** Типы источников нормативной информации. */
export type SourceType = 'НПА' | 'Стандарт' | 'Регламент' | 'Правила' | 'Норматив' | 'Роз\'яснення уповноваженого органу' | 'Методичні рекомендації';

/** Метаданные об официальном источнике нормативного требования. */
export interface SourceMeta {
  /** Уникальный идентификатор источника */
  id: string;
  /** Официальное наименование НПА или документа */
  title: string;
  /** Номер и дата принятия документа */
  documentNumber: string;
  /** Тип нормативного источника */
  sourceType: SourceType;
  /** Издавшая организация или орган власти */
  publisher: string;
  /** Дата последнего подтверждения актуальности редакторами LEX */
  verificationDate: string;
  /** Внешняя ссылка на официальный опубликованный документ */
  officialUrl?: string;
  /** Признак архивного или утратившего силу документа */
  isArchived?: boolean;
}

/** Проверяемая цитата из нормативного документа с привязкой к источнику. */
export interface Citation {
  /** Уникальный идентификатор цитаты */
  id: string;
  /** Текст цитаты из норматива */
  text: string;
  /** Метаданные источника цитаты */
  source: SourceMeta;
  /** Раздел, статья или пункт нормативного правового акта */
  sectionOrPage: string;
  /** Контекст вокруг цитаты (соседние абзацы) для детального просмотра */
  contextBefore?: string;
  /** Контекст после цитаты */
  contextAfter?: string;
  /** Редакторское пояснение к цитате */
  editorialNote?: string;
  /** Статус проверки данной цитаты */
  status: VerificationStatus;
}

/**
 * 1-й контур довідника: широкі розділи («кошики»).
 * Поле в даних лишається `categoryGroup` для сумісності споживачів.
 */
export type SituationCategoryGroup =
  | 'safety_management' // Організація охорони праці
  | 'preparation_admission' // Підготовка та допуск
  | 'documentation' // Документація та облік
  | 'rights_regulation' // Права, обов'язки, регулювання
  | 'working_conditions' // Умови праці та фактори
  | 'occupational_health' // Здоров’я та профзахворювання
  | 'ppe_protection' // ЗІЗ та колективний захист
  | 'equipment_systems' // Безпека обладнання та інженерних систем
  | 'hazardous_work' // Небезпечні роботи та устаткування
  | 'technology_processes' // Безпека технологічних процесів
  | 'risk_monitoring' // Ризики, моніторинг, прогнозування
  | 'emergency_response' // Реагування при НС та аваріях
  | 'accident_investigation' // Нещасні випадки та розслідування
  | 'first_aid' // Перша допомога
  | 'civil_protection' // Цивільний захист / ОПН
  | 'fire_explosion' // Пожежна та вибухова безпека
  | 'ecology' // Екологічні ризики
  | 'psychology_behavior' // Психологія безпеки
  | 'audit_improvement' // Контроль, експертиза, поліпшення

/** Канонічні розділи нового довідника LEX. */
export type ReferenceSectionId =
  | 'safety_management'
  | 'rights_relations'
  | 'worker_admission'
  | 'documents_records'
  | 'hazards_risks'
  | 'work_environment'
  | 'occupational_health'
  | 'protective_equipment'
  | 'equipment_systems'
  | 'high_risk_work'
  | 'technology_processes'
  | 'fire_explosion'
  | 'emergencies'
  | 'civil_radiation_chemical'
  | 'incidents_investigation'
  | 'first_aid'
  | 'environmental_safety'
  | 'ergonomics_human_factor'
  | 'audit_improvement';

/** Підрозділ — тематична група конкретних ситуацій усередині розділу. */
export interface ReferenceTopic {
  id: string;
  sectionId: ReferenceSectionId;
  title: string;
  order: number;
}

/** Розділ нового каталогу з власним набором підрозділів. */
export interface ReferenceSection {
  id: ReferenceSectionId;
  title: string;
  summary: string;
  order: number;
  topics: ReferenceTopic[];
}

/** Змістовний блок відповіді. Кількість і назви блоків визначає сам матеріал. */
export interface SituationAnswerBlock {
  id: string;
  title: string;
  content: string;
  responsibleRole?: string;
  deadlineText?: string;
}

/** Канонічна ситуація нового довідника, незалежна від фіксованих етапів. */
export interface ReferenceSituation {
  id: string;
  slug: string;
  title: string;
  sectionId: ReferenceSectionId;
  topicId: string;
  summary: string;
  answers: SituationAnswerBlock[];
  keyAttentionPoints: string[];
  status: VerificationStatus;
  lastCheckDate: string;
  relatedTermIds: string[];
  relatedFormIds: string[];
  relatedLearningTopicIds: string[];
  relatedSituationIds: string[];
}

/** Названия шести основных этапов действий в рамках рабочей ситуации. */
export type ActionPhaseId =
  | 'preparation' // 1. Подготовка
  | 'identification' // 2. Выявление и оценка
  | 'prevention' // 3. Предотвращение и защита
  | 'response' // 4. Реагирование
  | 'investigation' // 5. Расследование и оформление
  | 'recovery'; // 6. Восстановление и улучшение

/** Информация об одном из 6 этапов действий рабочей ситуации. */
export interface ActionPhase {
  /** Идентификатор этапа */
  id: ActionPhaseId;
  /** Порядковый номер этапа (от 1 до 6) */
  order: number;
  /** Заголовок этапа */
  title: string;
  /** Краткое описание назначения этапа */
  description: string;
  /** Применимость данного этапа к ситуации (true - показываем, false - пропускаем) */
  isApplicable: boolean;
  /** Подразделы с детальными сведениями и цитатами внутри этапа */
  subsections: SituationSubSection[];
}

/** Повторяемый подраздел внутри этапа рабочей ситуации. */
export interface SituationSubSection {
  /** Уникальный идентификатор подраздела */
  id: string;
  /** Заголовок подраздела (например, "Кого уведомить", "Сроки", "Документы", "Ответственный") */
  title: string;
  /** Текстовое описание подраздела */
  content: string;
  /** Набор проверенных цитат из НПА, подтверждающих требования */
  citations: Citation[];
  /** Обязательный статус выполнения подраздела */
  isRequired?: boolean;
  /** Закреплённый ответственный или роль (например, "Инженер по ОТ", "Работодатель") */
  responsibleRole?: string;
  /** Регламентированный срок исполнения */
  deadlineText?: string;
}

/** Рабочая ситуация по охране труда. */
export interface WorkingSituation {
  /** Уникальный идентификатор ситуации */
  id: string;
  /** Чловекочитаемый URL-слаг ситуации */
  slug: string;
  /** Название рабочей ситуации */
  title: string;
  /** Розділ 1-го контуру («кошик») */
  categoryGroup: SituationCategoryGroup;
  /** Коротка анотація для списку ситуацій у розділі */
  summary: string;
  /** На что обратить внимание (важные предупреждения) */
  keyAttentionPoints: string[];
  /** Шесть этапов действий для данной ситуации */
  phases: ActionPhase[];
  /** Общий статус актуальности сведений в ситуации */
  status: VerificationStatus;
  /** Дата последней проверки ситуации */
  lastCheckDate: string;
  /** Связанные идентификаторы терминов */
  relatedTermIds: string[];
  /** Связанные идентификаторы бланков */
  relatedFormIds: string[];
  /** Связанные идентификаторы учебных тем */
  relatedLearningTopicIds: string[];
  /** Идентификация смежных рабочих ситуаций */
  relatedSituationIds: string[];
}

/** Категория учебных направлений. */
export interface LearningDirection {
  /** Уникальный идентификатор направления */
  id: string;
  /** Чловекочитаемый слаг направления */
  slug: string;
  /** Название направления обучения (например, "Программа А", "СИЗ", "Высота") */
  title: string;
  /** Описание программы направления */
  description: string;
  /** Количество тем в данном направлении */
  topicCount: number;
}

/** Учебная тема по охране труда. */
export interface LearningTopic {
  /** Уникальный идентификатор темы */
  id: string;
  /** Чловекочитаемый слаг */
  slug: string;
  /** Идентификатор направления обучения */
  directionId: string;
  /** Название учебной темы */
  title: string;
  /** Сокращённое резюме учебного материала */
  summary: string;
  /** Ориентировочное время прохождения в минутах */
  estimatedMinutes: number;
  /** Содержание материала по разделам */
  sections: {
    id: string;
    heading: string;
    bodyText: string;
    citations?: Citation[];
  }[];
  /** Практические ситуации для самопроверки */
  practicalCases?: {
    id: string;
    caseTitle: string;
    scenarioText: string;
    recommendedAction: string;
  }[];
  /** Иллюстрации-заглушки или схемы */
  illustrationUrl?: string;
  /** Статус готовности материала */
  status: VerificationStatus;
  /** Связанные бланки и ситуации */
  relatedFormIds: string[];
  relatedSituationIds: string[];
  relatedTermIds: string[];
}

/** Бланк или шаблон документа по охране труда. */
export interface DocumentForm {
  /** Уникальный идентификатор бланка */
  id: string;
  /** Чловекочитаемый слаг */
  slug: string;
  /** Название бланка или журнала */
  title: string;
  /** Назначение документа и область применения */
  description: string;
  /** Категория бланка */
  category: 'briefings' | 'medical' | 'permits' | 'risks' | 'incidents' | 'accidents' | 'fire_safety' | 'audit';
  /** Доступные форматы для загрузки (demo) */
  formats: ('PDF' | 'DOCX' | 'XLSX')[];
  /** Номер версии бланка */
  version: string;
  /** Признак архивного документа */
  isArchived?: boolean;
  /** Кто оформляет документ */
  responsibleRole: string;
  /** Регламентированный срок оформления */
  duePeriodText: string;
  /** Правовое основание применения бланка */
  legalBasis: string;
  /** Статус проверки документа */
  status: VerificationStatus;
  /** Дата ревизии */
  verificationDate: string;
}

/** Официальный термин по охране труда. */
export interface SafetyTerm {
  /** Уникальный идентификатор термина */
  id: string;
  /** Чловекочитаемый слаг */
  slug: string;
  /** Официальное название термина */
  term: string;
  /** Первая буква термина для алфавитного указателя */
  firstLetter: string;
  /** Официальное нормативное определение из НПА */
  officialDefinition: string;
  /** Редакторское понятное пояснение простой речью */
  editorialExplanation: string;
  /** Источник официального определения */
  source: SourceMeta;
  /** Раздел/статья НПА */
  sectionOrArticle: string;
  /** Синонимы и близкие термины */
  synonyms: string[];
  /** Тематическая область */
  categoryGroup: SituationCategoryGroup;
  /** Связанные ситуации и учебные темы */
  relatedSituationIds: string[];
  relatedLearningTopicIds: string[];
}

/** Смисловий блок інструкції з домедичної допомоги. */
export interface FirstAidInstructionBlock {
  /** Короткий заголовок блоку дій. */
  title: string;
  /** Конкретні дії або умови, які потрібно виконати. */
  items: string[];
}

/** Элемент Первой помощи. */
export interface FirstAidArticle {
  id: string;
  slug: string;
  category: 'combat' | 'assessment' | 'breathing' | 'bleeding' | 'trauma' | 'burns' | 'electrocution' | 'cold' | 'poisoning' | 'water' | 'acute' | 'choking' | 'kit' | 'mistakes';
  title: string;
  shortSummary: string;
  /** Негайні дії, які виконують у визначеній послідовності. */
  emergencySteps: string[];
  /** Пояснення техніки, контролю результату та подальших дій. */
  instructionBlocks: FirstAidInstructionBlock[];
  prohibitedActions: string[];
  medicalRevisionDate: string;
  disclaimer: string;
  /** Медичні mock-картки не публікуються без перевірки. */
  publicationStatus: 'draft' | 'under_review' | 'published' | 'needs_review' | 'archived' | 'rejected';
}

/** Варианты типов материалов в поиске и избранном. */
export type MaterialType = 'situation' | 'learning' | 'form' | 'term' | 'citation' | 'first_aid';

/** Подсказка в выпадающем списке поиска. */
export interface SearchSuggestion {
  id: string;
  title: string;
  type: MaterialType;
  slug: string;
  contextSnippet: string;
}

/** Параметры поискового запроса. */
export interface SearchQuery {
  queryText: string;
  materialType?: MaterialType | 'all';
  sectionId?: ReferenceSectionId | 'all';
  statusFilter?: VerificationStatus | 'all';
  sortBy?: 'relevance' | 'date' | 'title';
  page?: number;
  pageSize?: number;
}

/** Элемент поисковой выдачи. */
export interface SearchResultItem {
  id: string;
  title: string;
  type: MaterialType;
  slug: string;
  snippet: string;
  sectionId?: ReferenceSectionId;
  status: VerificationStatus;
  verificationDate: string;
  citation?: Citation;
  matchType?: 'exact' | 'prefix' | 'fuzzy' | 'semantic';
}

/** Страница с результатами поиска. */
export interface SearchResultPage {
  items: SearchResultItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  queryText: string;
}

/** Сохранённый элемент в Избранном. */
export interface FavoriteItem {
  id: string;
  targetId: string;
  type: MaterialType;
  title: string;
  slug: string;
  summary: string;
  addedAt: string;
}
