/**
 * @fileoverview Централізований реєстр маршрутів застосунку LEX.
 * Містить шляхи, динамічні імпорти через React.lazy і назви сторінок.
 */

import { lazy, LazyExoticComponent, ComponentType } from 'react';

export interface RouteConfig {
  path: string;
  component: LazyExoticComponent<ComponentType<any>>;
  title: string;
}

export const ROUTES: RouteConfig[] = [
  {
    path: '/',
    component: lazy(() => import('../../modules/home').then((m) => ({ default: m.HomePage }))),
    title: 'Головна',
  },
  {
    path: '/search',
    component: lazy(() => import('../../modules/search').then((m) => ({ default: m.SearchPage }))),
    title: 'Пошук',
  },
  {
    path: '/reference',
    component: lazy(() => import('../../modules/reference').then((m) => ({ default: m.ReferenceCatalogPage }))),
    title: 'Довідник ситуацій',
  },
  {
    path: '/reference/:slug',
    component: lazy(() => import('../../modules/reference').then((m) => ({ default: m.SituationDetailPage }))),
    title: 'Деталі ситуації',
  },
  {
    path: '/learning',
    component: lazy(() => import('../../modules/learning').then((m) => ({ default: m.LearningCatalogPage }))),
    title: 'Навчання',
  },
  {
    path: '/learning/:slug',
    component: lazy(() => import('../../modules/learning').then((m) => ({ default: m.TopicDetailPage }))),
    title: 'Навчальна тема',
  },
  {
    path: '/first-aid',
    component: lazy(() => import('../../modules/firstAid').then((m) => ({ default: m.FirstAidPage }))),
    title: 'Перша допомога',
  },
  {
    path: '/forms',
    component: lazy(() => import('../../modules/forms').then((m) => ({ default: m.FormsCatalogPage }))),
    title: 'Бланки документів',
  },
  {
    path: '/forms/:slug',
    component: lazy(() => import('../../modules/forms').then((m) => ({ default: m.FormDetailPage }))),
    title: 'Деталі бланка',
  },
  {
    path: '/terms',
    component: lazy(() => import('../../modules/terms').then((m) => ({ default: m.TermsCatalogPage }))),
    title: 'Глосарій термінів',
  },
  {
    path: '/terms/:slug',
    component: lazy(() => import('../../modules/terms').then((m) => ({ default: m.TermDetailPage }))),
    title: 'Деталі терміна',
  },
  {
    path: '/favorites',
    component: lazy(() => import('../../modules/favorites').then((m) => ({ default: m.FavoritesPage }))),
    title: 'Обране',
  },
  {
    path: '/profile',
    component: lazy(() => import('../../modules/profile').then((m) => ({ default: m.ProfilePage }))),
    title: 'Профіль',
  },
  {
    path: '/admin',
    component: lazy(() => import('../../modules/admin').then((m) => ({ default: m.AdminLayout }))),
    title: 'Адміністрування',
  },
  {
    path: '/admin/sources',
    component: lazy(() => import('../../modules/admin').then((m) => ({ default: m.AdminSourcesPage }))),
    title: 'Адміністрування джерел',
  },
  {
    path: '/admin/terms',
    component: lazy(() => import('../../modules/admin').then((m) => ({ default: m.AdminTermsPage }))),
    title: 'Адміністрування термінів',
  },
  {
    path: '/admin/citations',
    component: lazy(() => import('../../modules/admin').then((m) => ({ default: m.AdminCitationsPage }))),
    title: 'Адміністрування цитат',
  },
  {
    path: '/admin/situations',
    component: lazy(() => import('../../modules/admin').then((m) => ({ default: m.AdminSituationsPage }))),
    title: 'Адміністрування ситуацій',
  },
  {
    path: '/admin/situations/:slug',
    component: lazy(() => import('../../modules/admin').then((m) => ({ default: m.AdminSituationDetailPage }))),
    title: 'Редактор ситуації',
  },
  {
    path: '/admin/forms',
    component: lazy(() => import('../../modules/admin').then((m) => ({ default: m.AdminFormsPage }))),
    title: 'Адміністрування форм',
  },
  {
    path: '/admin/learning',
    component: lazy(() => import('../../modules/admin').then((m) => ({ default: m.AdminLearningPage }))),
    title: 'Адміністрування навчання',
  },
  {
    path: '/admin/first-aid',
    component: lazy(() => import('../../modules/admin').then((m) => ({ default: m.AdminFirstAidPage }))),
    title: 'Адміністрування домедичної допомоги',
  },
];
