/**
 * @fileoverview Сервис алфавитного глоссария терминов по охране труда.
 */

import { SafetyTerm } from '../../shared/types';
import { MOCK_TERMS } from '../data/termsData';
import { mockScenarioManager } from './mockScenario';

/** Интерфейс сервиса терминов. */
export interface ITermsService {
  /** Возвращает термины с фильтрацией по первой букве, поиску и категории */
  getTerms(letter?: string, queryText?: string, categoryGroup?: string): Promise<SafetyTerm[]>;
  /** Возвращает список всех уникальных первых букв терминов */
  getAlphabet(): Promise<string[]>;
  /** Находит термин по слагу */
  getTermBySlug(slug: string): Promise<SafetyTerm | null>;
}

/**
 * Реализация сервиса терминов на mock-данных.
 */
export class MockTermsService implements ITermsService {
  /**
   * Возвращает список терминов с фильтром по букве и поисковому тексту.
   * @param letter Буква алфавита или 'all'
   * @param queryText Поисковая строка
   * @param categoryGroup Категория или 'all'
   */
  async getTerms(letter: string = 'all', queryText: string = '', categoryGroup: string = 'all'): Promise<SafetyTerm[]> {
    const filtered = MOCK_TERMS.filter((term) => {
      if (letter !== 'all' && term.firstLetter !== letter) return false;
      if (categoryGroup !== 'all' && term.categoryGroup !== categoryGroup) return false;

      if (queryText.trim()) {
        const q = queryText.toLowerCase();
        const matchesTerm = term.term.toLowerCase().includes(q);
        const matchesOfficial = term.officialDefinition.toLowerCase().includes(q);
        const matchesEditorial = term.editorialExplanation.toLowerCase().includes(q);
        const matchesSynonym = term.synonyms.some((s) => s.toLowerCase().includes(q));
        if (!matchesTerm && !matchesOfficial && !matchesEditorial && !matchesSynonym) return false;
      }
      return true;
    });

    return mockScenarioManager.simulateRequest(filtered, []);
  }

  /**
   * Возвращает уникальные отсортированные первые буквы всех терминов.
   */
  async getAlphabet(): Promise<string[]> {
    const letters = Array.from(new Set(MOCK_TERMS.map((t) => t.firstLetter))).sort((a, b) => a.localeCompare(b, 'ru'));
    return mockScenarioManager.simulateRequest(letters, []);
  }

  /**
   * Находит термин по слагу.
   * @param slug Чловекочитаемый идентификатор термина
   */
  async getTermBySlug(slug: string): Promise<SafetyTerm | null> {
    const term = MOCK_TERMS.find((t) => t.slug === slug) || null;
    return mockScenarioManager.simulateRequest(term, null);
  }
}

/** Экземпляр сервиса терминов. */
export const termsService = new MockTermsService();
