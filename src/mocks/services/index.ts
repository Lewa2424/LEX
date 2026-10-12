/**
 * @fileoverview Публичный реестр сервисов и контрактов данных LEX (Service Registry).
 * Предоставляет унифицированный доступ к инстансам сервисов.
 */

import { referenceService, IReferenceService } from './ReferenceService';
import { learningService, ILearningService } from './LearningService';
import { firstAidService, IFirstAidService } from './FirstAidService';
import { formsService, IFormsService } from './FormsService';
import { termsService, ITermsService } from './TermsService';
import { searchService, ISearchService } from './SearchService';
import { favoritesService, IFavoritesService } from './FavoritesService';
import { mockScenarioManager, MockScenarioType } from './mockScenario';

export * from './ReferenceService';
export * from './LearningService';
export * from './FirstAidService';
export * from './FormsService';
export * from './TermsService';
export * from './SearchService';
export * from './FavoritesService';
export * from './mockScenario';

export interface ServiceRegistry {
  reference: IReferenceService;
  learning: ILearningService;
  firstAid: IFirstAidService;
  forms: IFormsService;
  terms: ITermsService;
  search: ISearchService;
  favorites: IFavoritesService;
  setScenario: (scenario: MockScenarioType) => void;
  getScenario: () => MockScenarioType;
}

/** Единый реестр сервисов приложения */
export const services: ServiceRegistry = {
  reference: referenceService,
  learning: learningService,
  firstAid: firstAidService,
  forms: formsService,
  terms: termsService,
  search: searchService,
  favorites: favoritesService,
  setScenario: (scenario: MockScenarioType) => mockScenarioManager.setScenario(scenario),
  getScenario: () => mockScenarioManager.getScenario(),
};
