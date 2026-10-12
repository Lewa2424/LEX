/**
 * @fileoverview Сервис учебных курсов и тем по охране труда.
 */

import { LearningDirection, LearningTopic } from '../../shared/types';
import { MOCK_LEARNING_DIRECTIONS, MOCK_LEARNING_TOPICS } from '../data/learningData';
import { mockScenarioManager } from './mockScenario';

/** Интерфейс учебного сервиса. */
export interface ILearningService {
  /** Возвращает список направлений обучения */
  getDirections(): Promise<LearningDirection[]>;
  /** Возвращает список тем обучения с фильтром по направлению */
  getTopics(directionId?: string): Promise<LearningTopic[]>;
  /** Возвращает учебную тему по слагу */
  getTopicBySlug(slug: string): Promise<LearningTopic | null>;
}

/**
 * Реализация учебного сервиса на mock-данных.
 */
export class MockLearningService implements ILearningService {
  /** Возвращает список всех учебных направлений. */
  async getDirections(): Promise<LearningDirection[]> {
    return mockScenarioManager.simulateRequest(MOCK_LEARNING_DIRECTIONS, []);
  }

  /**
   * Возвращает темы обучения.
   * @param directionId Необязательный ID направления
   */
  async getTopics(directionId?: string): Promise<LearningTopic[]> {
    const data = (!directionId || directionId === 'all')
      ? MOCK_LEARNING_TOPICS
      : MOCK_LEARNING_TOPICS.filter((t) => t.directionId === directionId);

    return mockScenarioManager.simulateRequest(data, []);
  }

  /**
   * Находит учебную тему по её слагу.
   * @param slug Чловекочитаемый идентификатор темы
   */
  async getTopicBySlug(slug: string): Promise<LearningTopic | null> {
    const topic = MOCK_LEARNING_TOPICS.find((t) => t.slug === slug) || null;
    return mockScenarioManager.simulateRequest(topic, null);
  }
}

/** Экземпляр сервиса обучения. */
export const learningService = new MockLearningService();
