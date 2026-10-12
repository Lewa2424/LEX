/**
 * @fileoverview Алфавитный глоссарий официальных терминов и понятий по охране труда для LEX.
 * Визуально и семантически разделяет официальную цитату из стандарта и понятное редакторское пояснение.
 */

import { SafetyTerm } from '../../shared/types';
import { MOCK_SOURCES } from './sourcesData';
import { DEMO_DISCLAIMER_TEXT } from './situationsData';

/** Набор из 12 нейтральных терминов по охране труда. */
export const MOCK_TERMS: SafetyTerm[] = [
  {
    id: 'term-1',
    slug: 'ohrana-truda',
    term: 'Охорона праці',
    firstLetter: 'О',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Система збереження життя та здоров'я працівників у процесі трудової діяльності, що включає правові, соціально-економічні, організаційно-технічні, санітарно-гігієнічні, лікувально-профілактичні та інші заходи.`,
    editorialExplanation: 'Охорона праці — це повний комплекс заходів, правил і обладнання, який організація зобов\'язана створити, щоб працівник виконував роботу без ризику для здоров\'я.',
    source: MOCK_SOURCES[0],
    sectionOrArticle: 'Розділ I, Стаття 1.1',
    synonyms: ['Безпека праці', 'ОП'],
    categoryGroup: 'preparation_admission',
    relatedSituationIds: ['sit-1', 'sit-6'],
    relatedLearningTopicIds: ['topic-1', 'topic-7']
  },
  {
    id: 'term-2',
    slug: 'vredny-proizvodstvenny-faktor',
    term: 'Шкідливий виробничий фактор',
    firstLetter: 'Ш',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Фактор виробничого середовища або трудового процесу, вплив якого на працівника може призвести до його захворювання.`,
    editorialExplanation: 'Умови на робочому місці (наприклад, постійний шум, пил, хімічні випари або вібрація), які поступово погіршують здоров\'я людини.',
    source: MOCK_SOURCES[0],
    sectionOrArticle: 'Розділ I, Стаття 1.2',
    synonyms: ['Шкідливий фактор', 'Профшкідливість'],
    categoryGroup: 'working_conditions',
    relatedSituationIds: ['sit-12'],
    relatedLearningTopicIds: ['topic-2']
  },
  {
    id: 'term-3',
    slug: 'opasny-proizvodstvenny-faktor',
    term: 'Небезпечний виробничий фактор',
    firstLetter: 'Н',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Фактор виробничого середовища або трудового процесу, вплив якого на працівника може призвести до його травми або загибелі.`,
    editorialExplanation: 'Фактор, який може завдати миттєвої шкоди людині (наприклад, відкриті оголені проводи під напругою, рухомі вузли обладнання або робота на висоті).',
    source: MOCK_SOURCES[0],
    sectionOrArticle: 'Розділ I, Стаття 1.3',
    synonyms: ['Небезпека на виробництві'],
    categoryGroup: 'working_conditions',
    relatedSituationIds: ['sit-2'],
    relatedLearningTopicIds: ['topic-3']
  },
  {
    id: 'term-4',
    slug: 'sredstva-individualnoy-zaschity',
    term: 'Засоби індивідуального захисту (ЗІЗ)',
    firstLetter: 'З',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Засоби, що використовуються для запобігання або зменшення впливу на працівників шкідливих і (або) небезпечних виробничих факторів, а також для захисту від забруднення.`,
    editorialExplanation: 'Особисте спорядження та одяг працівника (каска, рукавички, респіратор, захисні окуляри, страхувальна прив\'язь), що захищають від травм і шкідливих речовин.',
    source: MOCK_SOURCES[3],
    sectionOrArticle: 'Розділ I, п. 3',
    synonyms: ['ЗІЗ', 'Спецодяг', 'Захисні засоби'],
    categoryGroup: 'ppe_protection',
    relatedSituationIds: ['sit-5'],
    relatedLearningTopicIds: ['topic-2']
  },
  {
    id: 'term-5',
    slug: 'professionalny-risk',
    term: 'Професійний ризик',
    firstLetter: 'П',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Ймовірність заподіяння шкоди здоров'ю внаслідок впливу шкідливих і (або) небезпечних виробничих факторів під час виконання працівником трудових обов'язків.`,
    editorialExplanation: 'Ймовірність того, що працівник отримає травму або захворіє на конкретному робочому місці, з урахуванням умов праці та наявності захисних огорож.',
    source: MOCK_SOURCES[0],
    sectionOrArticle: 'Розділ II, Стаття 2.1',
    synonyms: ['Ризик на робочому місці', 'ОПР'],
    categoryGroup: 'risk_monitoring',
    relatedSituationIds: ['sit-9'],
    relatedLearningTopicIds: ['topic-7']
  },
  {
    id: 'term-6',
    slug: 'neschastny-sluchay-na-proizvodstve',
    term: 'Нещасний випадок на виробництві',
    firstLetter: 'Н',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Подія, внаслідок якої працівник отримав ушкодження або інше пошкодження здоров'я під час виконання ним трудових обов'язків і яке спричинило необхідність переведення на іншу роботу, втрату працездатності або загибель.`,
    editorialExplanation: 'Подія під час виконання роботи або слідування службовим транспортом, що призвела до травми працівника.',
    source: MOCK_SOURCES[0],
    sectionOrArticle: 'Розділ III, Стаття 3.1',
    synonyms: ['Травма на виробництві', 'Виробничий травматизм'],
    categoryGroup: 'accident_investigation',
    relatedSituationIds: ['sit-3'],
    relatedLearningTopicIds: ['topic-6']
  },
  {
    id: 'term-7',
    slug: 'specialnaya-ocenka-usloviy-truda',
    term: 'Оцінка умов праці на робочих місцях',
    firstLetter: 'О',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Єдиний комплекс послідовно здійснюваних заходів з ідентифікації шкідливих і (або) небезпечних факторів виробничого середовища та оцінки рівня їхнього впливу на працівника.`,
    editorialExplanation: 'Обов\'язкова регулярна перевірка робочих місць спеціалізованою лабораторією для визначення класів умов праці та призначення компенсацій.',
    source: MOCK_SOURCES[0],
    sectionOrArticle: 'Стандарт № 101-ОТ, п. 4',
    synonyms: ['Оцінка умов праці', 'Атестація робочих місць'],
    categoryGroup: 'working_conditions',
    relatedSituationIds: ['sit-6'],
    relatedLearningTopicIds: ['topic-1']
  },
  {
    id: 'term-8',
    slug: 'instruktazh-po-ohrane-truda',
    term: 'Інструктаж з техніки безпеки',
    firstLetter: 'І',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Форма інформування та навчання працівників безпечним методам і прийомам виконання робіт з метою запобігання травматизму.`,
    editorialExplanation: 'Пояснення працівникові правил безпеки на робочому місці з подальшим усним опитуванням і реєстрацією в документі обліку.',
    source: MOCK_SOURCES[1],
    sectionOrArticle: 'Розділ II, п. 8',
    synonyms: ['Інструктаж', 'Вступний інструктаж'],
    categoryGroup: 'preparation_admission',
    relatedSituationIds: ['sit-1'],
    relatedLearningTopicIds: ['topic-1']
  },
  {
    id: 'term-9',
    slug: 'naryad-dusk',
    term: 'Наряд-допуск',
    firstLetter: 'Н',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Завдання на безпечне виконання роботи, оформлене на спеціальному бланку встановленої форми та що визначає зміст, місце роботи, час її початку й закінчення, умови безпечного проведення, склад бригади та осіб, відповідальних за безпеку.`,
    editorialExplanation: 'Письмовий документ-дозвіл на проведення робіт із підвищеною небезпекою (висота, вогневі роботи, розкопки) з призначенням відповідальних і переліком заходів захисту.',
    source: MOCK_SOURCES[2],
    sectionOrArticle: 'Розділ II, п. 28',
    synonyms: ['Дозвіл на роботи підвищеної небезпеки'],
    categoryGroup: 'hazardous_work',
    relatedSituationIds: ['sit-2'],
    relatedLearningTopicIds: ['topic-3']
  },
  {
    id: 'term-10',
    slug: 'obazatelny-medosmotr',
    term: 'Обов\'язковий медичний огляд',
    firstLetter: 'О',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Медичне обстеження працівників, що проводиться з метою визначення відповідності стану здоров'я дорученій роботі та своєчасного виявлення професійних захворювань.`,
    editorialExplanation: 'Обов\'язкові обстеження у лікарів перед прийомом на роботу та періодично в процесі роботи за рахунок коштів роботодавця.',
    source: MOCK_SOURCES[4],
    sectionOrArticle: 'Регламент № 505-МД, п. 12',
    synonyms: ['Медогляд', 'Профогляд'],
    categoryGroup: 'preparation_admission',
    relatedSituationIds: ['sit-4'],
    relatedLearningTopicIds: ['topic-1']
  },
  {
    id: 'term-11',
    slug: 'mikrotravma',
    term: 'Мікропошкодження (мікротравма)',
    firstLetter: 'М',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Подряпини, крововиводи, забої м'яких тканин, поверхневі рани та інші пошкодження, отримані працівниками під час виконання трудових обов'язків, що не спричинили розладу здоров'я або тимчасової втрати працездатності.`,
    editorialExplanation: 'Дрібні пошкодження (подряпина, ссадина, легкий забій), що не потребують лікарняного, але підлягають обліку та розгляду уповноваженими особами.',
    source: MOCK_SOURCES[0],
    sectionOrArticle: 'Розділ III, Стаття 3.4',
    synonyms: ['Мікротравма', 'Легкий забій'],
    categoryGroup: 'accident_investigation',
    relatedSituationIds: ['sit-3'],
    relatedLearningTopicIds: ['topic-6']
  },
  {
    id: 'term-12',
    slug: 'pervaya-pomoshch',
    term: 'Перша допомога',
    firstLetter: 'П',
    officialDefinition: `${DEMO_DISCLAIMER_TEXT} Комплекс базових заходів, спрямованих на підтримання життя та здоров'я потерпілих, що надаються особами до прибуття кваліфікованих медичних працівників.`,
    editorialExplanation: 'Найпростіші невідкладні дії, що виконуються навченими колегами або очевидцями до прибуття швидкої допомоги.',
    source: MOCK_SOURCES[0],
    sectionOrArticle: 'Розділ III, Стаття 3.8',
    synonyms: ['Доглядова допомога'],
    categoryGroup: 'first_aid',
    relatedSituationIds: ['sit-7'],
    relatedLearningTopicIds: ['topic-4']
  }
];
