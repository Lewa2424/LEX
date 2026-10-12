/**
 * @fileoverview Демонстрационный каталог бланков, шаблонов документов и журналов по охране труда.
 */

import { DocumentForm } from '../../shared/types';

/** Набор из 8 нейтральных демонстрационных бланков и журналов. */
export const MOCK_FORMS: DocumentForm[] = [
  {
    id: 'form-1',
    slug: 'akt-n-1-o-neschastnom-sluchae',
    title: 'Акт про розслідування події щодо нещасного випадку на виробництві',
    description: 'Офіційна демонстраційна форма документа, що складається комісією за результатами розслідування нещасного випадку, пов\'язаного з виробництвом.',
    category: 'incidents',
    formats: ['PDF', 'DOCX'],
    version: '2026.1',
    responsibleRole: 'Голова комісії з розслідування',
    duePeriodText: 'Протягом 3 днів після завершення розслідування',
    legalBasis: 'Стандарт безпеки № 101-ОТ',
    status: 'under_review',
    verificationDate: '10.01.2026'
  },
  {
    id: 'form-2',
    slug: 'zhurnal-registracii-instruktazhey',
    title: 'Журнал реєстрації інструктажів з техніки безпеки',
    description: 'Типовий журнал для фіксації первинного, повторного, позапланового та цільового інструктажів з особистими підписами інструктора та працівника.',
    category: 'briefings',
    formats: ['PDF', 'DOCX'],
    version: '2025.3',
    responsibleRole: 'Безпосередній керівник робіт',
    duePeriodText: 'У день проведення інструктажу',
    legalBasis: 'Регламент безпеки № 202-ОБ',
    status: 'under_review',
    verificationDate: '15.01.2026'
  },
  {
    id: 'form-3',
    slug: 'naryad-dusk-na-raboty-povyshennoy-opasnosti',
    title: 'Наряд-допуск на проведення робіт підвищеної небезпеки',
    description: 'Бланк спеціального дозволу на виконання альпіністських, вогневих і земляних робіт у зонах із підвищеним ризиком.',
    category: 'permits',
    formats: ['PDF', 'DOCX'],
    version: '2026.1',
    responsibleRole: 'Особа, що видала наряд-допуск',
    duePeriodText: 'Перед початком виконання робіт (видається на строк до 15 днів)',
    legalBasis: 'Правила безпеки № 303-ВК',
    status: 'under_review',
    verificationDate: '01.02.2026'
  },
  {
    id: 'form-4',
    slug: 'lichnaya-kartochka-ucheta-vydachi-siz',
    title: 'Особиста картка обліку видачі засобів індивідуального захисту',
    description: 'Форма індивідуального обліку видачі та повернення спецодягу, спецвзуття та запобіжних пристосувань.',
    category: 'risks',
    formats: ['PDF', 'DOCX', 'XLSX'],
    version: '2025.2',
    responsibleRole: 'Комірник / Відповідальний за видачу ЗІЗ',
    duePeriodText: 'Під час видачі та здачі ЗІЗ',
    legalBasis: 'Норматив ЗІЗ № 404-ЗЩ',
    status: 'under_review',
    verificationDate: '12.01.2026'
  },
  {
    id: 'form-5',
    slug: 'programma-vvodnogo-instruktazha',
    title: 'Типова програма проведення вступного інструктажу з безпеки',
    description: 'Шаблон програми вступного інструктажу, що містить загальні відомості про організацію, правила поведінки на території та вимоги гігієни.',
    category: 'briefings',
    formats: ['DOCX'],
    version: '2026.1',
    responsibleRole: 'Фахівець з охорони праці',
    duePeriodText: 'Розробляється 1 раз і актуалізується при змінах',
    legalBasis: 'Регламент безпеки № 202-ОБ',
    status: 'under_review',
    verificationDate: '20.01.2026'
  },
  {
    id: 'form-6',
    slug: 'perechen-professiy-i-normy-siz',
    title: 'Перелік професій і норм безкоштовної видачі ЗІЗ підприємства',
    description: 'Локальний нормативний акт компанії зі списком посад і затвердженими комплектами ЗІЗ, що видаються.',
    category: 'risks',
    formats: ['DOCX', 'XLSX'],
    version: '2026.2',
    responsibleRole: 'Керівник служби охорони праці',
    duePeriodText: 'Затверджується роботодавцем',
    legalBasis: 'Норматив ЗІЗ № 404-ЗЩ',
    status: 'under_review',
    verificationDate: '05.02.2026'
  },
  {
    id: 'form-7',
    slug: 'reestr-opasnostey-i-kartochka-riska',
    title: 'Реєстр небезпек і карта оцінки професійних ризиків',
    description: 'Зведений документ з ідентифікацією шкідливих і небезпечних факторів за робочими місцями та розрахованими рівнями ризику.',
    category: 'audit',
    formats: ['DOCX', 'XLSX'],
    version: '2026.1',
    responsibleRole: 'Фахівець з оцінки ризиків',
    duePeriodText: 'Оновлюється при впровадженні нового обладнання та процесів',
    legalBasis: 'Стандарт безпеки № 101-ОТ',
    status: 'under_review',
    verificationDate: '18.01.2026'
  },
  {
    id: 'form-8',
    slug: 'izveshchenie-o-neschastnom-sluchae',
    title: 'Повідомлення про подію на виробництві',
    description: 'Офіційна форма екстреного сповіщення уповноважених органів і страхових служб.',
    category: 'incidents',
    formats: ['PDF', 'DOCX'],
    version: '2025.1',
    responsibleRole: 'Роботодавець / Наймач',
    duePeriodText: 'Протягом 24 годин після події',
    legalBasis: 'Стандарт безпеки № 101-ОТ',
    status: 'under_review',
    verificationDate: '08.01.2026'
  }
];
