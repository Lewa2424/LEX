/**
 * @fileoverview Демонстрационные учебные материалы и курсы по охране труда для LEX.
 */

import { LearningDirection, LearningTopic } from '../../shared/types';
import { MOCK_SOURCES } from './sourcesData';
import { DEMO_DISCLAIMER_TEXT } from './situationsData';

/** Направления обучения по охране труда. */
export const MOCK_LEARNING_DIRECTIONS: LearningDirection[] = [
  {
    id: 'dir-1',
    slug: 'programma-a-obshchie-voprosy',
    title: 'Програма А. Загальні питання охорони праці',
    description: 'Основи норм безпеки, система управління охороною праці (СУОП), права та обов\'язки працівника й організації.',
    topicCount: 3,
  },
  {
    id: 'dir-2',
    slug: 'programma-b-bezopasnye-metody',
    title: 'Програма Б. Безпечні методи виконання робіт',
    description: 'Оцінка ризиків, застосування ЗІЗ, безпечне проведення навантажувальних, будівельних і ремонтних робіт.',
    topicCount: 3,
  },
  {
    id: 'dir-3',
    slug: 'programma-v-raboty-povyshennoy-opasnosti',
    title: 'Програма В. Роботи підвищеної небезпеки',
    description: 'Роботи на висоті, у замкнених просторах, вогневі та альпіністські роботи за нарядом-допуском.',
    topicCount: 2,
  },
];

/** Набор из 8 демонстрационных учебных тем. */
export const MOCK_LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'topic-1',
    slug: 'osnovy-zakonodatelstva-ob-ohrane-truda',
    directionId: 'dir-1',
    title: 'Основи стандартів охорони праці та права працівників',
    summary: 'Короткий посібник із ключових розділів стандартів безпеки, внутрішнього контролю та системи управління охороною праці.',
    estimatedMinutes: 20,
    status: 'under_review',
    illustrationUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    relatedFormIds: ['form-2', 'form-5'],
    relatedSituationIds: ['sit-1', 'sit-4'],
    relatedTermIds: ['term-1', 'term-8'],
    sections: [
      {
        id: 'sec-1-1',
        heading: 'Основні стандарти охорони праці',
        bodyText: 'Нормативна база гарантує право кожного працівника на умови праці, що відповідають вимогам безпеки та гігієни.',
        citations: [
          {
            id: 'cit-topic-1',
            text: `${DEMO_DISCLAIMER_TEXT} Кожен працівник має право на робоче місце, що відповідає вимогам охорони праці.`,
            source: MOCK_SOURCES[0],
            sectionOrPage: 'Розділ I, п. 2',
            status: 'under_review'
          }
        ]
      },
      {
        id: 'sec-1-2',
        heading: 'Обов\'язки працівника в галузі охорони праці',
        bodyText: 'Працівник зобов\'язаний дотримуватися вимог охорони праці, правильно застосовувати ЗІЗ, проходити навчання та медогляди, а також негайно повідомляти керівника про будь-які ситуації, що загрожують життю та здоров\'ю.',
      }
    ],
    practicalCases: [
      {
        id: 'case-1-1',
        caseTitle: 'Відмова від виконання роботи при загрозі життю',
        scenarioText: 'Працівника виявлено на об\'єкті без страхувальної прив\'язі на висоті 4 метри. Бригадир вимагає продовження монтажу.',
        recommendedAction: 'Працівник має право відмовитися від виконання роботи при виникненні небезпеки для його життя внаслідок порушення вимог охорони праці до усунення такої небезпеки.'
      }
    ]
  },
  {
    id: 'topic-2',
    slug: 'pravyla-vydachi-ta-zastosuvannya-ziz',
    directionId: 'dir-2',
    title: 'Правила застосування засобів індивідуального захисту (ЗІЗ)',
    summary: 'Навчальний модуль з класифікації ЗІЗ, порядку видачі за нормативами, особистих карток і перевірки справності.',
    estimatedMinutes: 15,
    status: 'under_review',
    illustrationUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    relatedFormIds: ['form-4', 'form-6'],
    relatedSituationIds: ['sit-5'],
    relatedTermIds: ['term-4'],
    sections: [
      {
        id: 'sec-2-1',
        heading: 'Порядок видачі ЗІЗ',
        bodyText: 'Видача ЗІЗ здійснюється безкоштовно на підставі Єдиних типових норм і затвердженого локального акту підприємства.',
      }
    ]
  },
  {
    id: 'topic-3',
    slug: 'raboty-na-vysote-trebovaniya-bezopasnosti',
    directionId: 'dir-3',
    title: 'Безпека під час виконання робіт на висоті',
    summary: 'Правила підбору анкерних пристроїв, огляду прив\'язей, оформлення наряду-допуску та рятувальних операцій.',
    estimatedMinutes: 25,
    status: 'under_review',
    illustrationUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    relatedFormIds: ['form-3'],
    relatedSituationIds: ['sit-2'],
    relatedTermIds: ['term-3', 'term-9'],
    sections: [
      {
        id: 'sec-3-1',
        heading: 'Системи забезпечення безпеки',
        bodyText: 'Складаються з анкерного пристрою, з\'єднувальної підсистеми (строп, амортизатор) та утримувальної або страхувальної прив\'язі.',
      }
    ]
  },
  {
    id: 'topic-4',
    slug: 'nadannya-pershoyi-dopomogy-postrazhdalym',
    directionId: 'dir-1',
    title: 'Базові принципи доглядової допомоги (Макетна тема)',
    summary: 'Демонстраційний навчальний модуль для ознайомлення зі структурою подачі навчального матеріалу з першої допомоги.',
    estimatedMinutes: 30,
    status: 'under_review',
    illustrationUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    relatedFormIds: [],
    relatedSituationIds: ['sit-7', 'sit-3'],
    relatedTermIds: ['term-12'],
    sections: [
      {
        id: 'sec-4-1',
        heading: 'Первинний огляд (Макет)',
        bodyText: 'Демонстраційний блок для виведення методичних матеріалів після підключення перевіреної бази знань.',
      }
    ]
  },
  {
    id: 'topic-5',
    slug: 'elektrobezpeka-vymogy-do-personalu',
    directionId: 'dir-2',
    title: 'Електробезпека: групи допуску та правила роботи',
    summary: 'Класифікація електроустановок, захисне заземлення, робота з електроінструментом і присвоєння груп.',
    estimatedMinutes: 20,
    status: 'under_review',
    relatedFormIds: ['form-2'],
    relatedSituationIds: ['sit-10'],
    relatedTermIds: ['term-2'],
    sections: []
  },
  {
    id: 'topic-6',
    slug: 'poryadok-rozsliduvannya-neschasnyh-vypadkiv',
    directionId: 'dir-1',
    title: 'Порядок розслідування та обліку нещасних випадків',
    summary: 'Кваліфікація подій, порядок сповіщення, робота комісії, оформлення акта розслідування.',
    estimatedMinutes: 35,
    status: 'under_review',
    relatedFormIds: ['form-1', 'form-8'],
    relatedSituationIds: ['sit-3'],
    relatedTermIds: ['term-6', 'term-11'],
    sections: []
  },
  {
    id: 'topic-7',
    slug: 'systema-upravlinnya-ohoronoyu-praci-suop',
    directionId: 'dir-2',
    title: 'Розробка та впровадження системи управління охороною праці (СУОП)',
    summary: 'Політика, розподіл обов\'язків, процедура управління ризиками, аудит і безперервне вдосконалення.',
    estimatedMinutes: 25,
    status: 'under_review',
    relatedFormIds: ['form-7'],
    relatedSituationIds: ['sit-6', 'sit-9'],
    relatedTermIds: ['term-1', 'term-5'],
    sections: []
  },
  {
    id: 'topic-8',
    slug: 'pozhezhna-bezpeka-na-pidpryyemstvi',
    directionId: 'dir-3',
    title: 'Пожежно-технічний мінімум і дії при пожежі',
    summary: 'Правила експлуатації вогнегасників, утримання евакуаційних шляхів, інструктажі та тренування з евакуації.',
    estimatedMinutes: 15,
    status: 'under_review',
    relatedFormIds: ['form-2'],
    relatedSituationIds: ['sit-11'],
    relatedTermIds: ['term-8'],
    sections: []
  }
];
