/**
 * @fileoverview Сервис каталога бланков и образцов документов.
 */

import { DocumentForm } from '../../shared/types';
import { MOCK_FORMS } from '../data/formsData';
import { mockScenarioManager } from './mockScenario';

/** Интерфейс сервиса бланков. */
export interface IFormsService {
  /** Возвращает список бланков с фильтрацией по категории и поиску */
  getForms(category?: string, queryText?: string): Promise<DocumentForm[]>;
  /** Возвращает бланк по слагу */
  getFormBySlug(slug: string): Promise<DocumentForm | null>;
}

/**
 * Реализация сервиса бланков на mock-данных.
 */
export class MockFormsService implements IFormsService {
  /**
   * Возвращает каталог бланков с поиском и фильтром по категории.
   * @param category Категория бланка
   * @param queryText Поисковая строка
   */
  async getForms(category: string = 'all', queryText: string = ''): Promise<DocumentForm[]> {
    const filtered = MOCK_FORMS.filter((form) => {
      if (category !== 'all' && form.category !== category) return false;
      if (queryText.trim()) {
        const q = queryText.toLowerCase();
        const matchesTitle = form.title.toLowerCase().includes(q);
        const matchesDesc = form.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });

    return mockScenarioManager.simulateRequest(filtered, []);
  }

  /**
   * Находит бланк по слагу.
   * @param slug Чловекочитаемый URL бланка
   */
  async getFormBySlug(slug: string): Promise<DocumentForm | null> {
    const form = MOCK_FORMS.find((f) => f.slug === slug) || null;
    return mockScenarioManager.simulateRequest(form, null);
  }
}

/** Экземпляр сервиса бланков. */
export const formsService = new MockFormsService();
