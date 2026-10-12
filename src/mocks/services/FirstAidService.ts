/**
 * @fileoverview Сервис материалов по первой помощи.
 */

import { FirstAidArticle } from '../../shared/types';
import { MOCK_FIRST_AID_ARTICLES } from '../data/firstAidData';
import { mockScenarioManager } from './mockScenario';

/** Интерфейс сервиса первой помощи. */
export interface IFirstAidService {
  /** Возвращает статьи по первой помощи с фильтром по категории */
  getArticles(category?: string): Promise<FirstAidArticle[]>;
  /** Возвращает статью по слагу */
  getArticleBySlug(slug: string): Promise<FirstAidArticle | null>;
}

/**
 * Реализация сервиса первой помощи на mock-данных.
 */
export class MockFirstAidService implements IFirstAidService {
  /**
   * Возвращает список алгоритмов первой помощи.
   * @param category Категория или 'all'
   */
  async getArticles(category: string = 'all'): Promise<FirstAidArticle[]> {
    // Public API: only published materials. Drafts stay in admin until medical review.
    const published = MOCK_FIRST_AID_ARTICLES.filter((a) => a.publicationStatus === 'published');
    const data = category === 'all'
      ? published
      : published.filter((a) => a.category === category);

    return mockScenarioManager.simulateRequest(data, []);
  }

  /**
   * Находит статью по слагу.
   * @param slug Чловекочитаемый слаг статьи
   */
  async getArticleBySlug(slug: string): Promise<FirstAidArticle | null> {
    const article = MOCK_FIRST_AID_ARTICLES.find(
      (a) => a.slug === slug && a.publicationStatus === 'published',
    ) || null;
    return mockScenarioManager.simulateRequest(article, null);
  }
}

/** Экземпляр сервиса первой помощи. */
export const firstAidService = new MockFirstAidService();
