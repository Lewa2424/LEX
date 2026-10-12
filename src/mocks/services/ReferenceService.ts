/** Сервіс нового довідника: розділи, підрозділи та змістовні ситуації. */
import type { ReferenceSection, ReferenceSectionId, ReferenceSituation } from '../../shared/types';
import { isPublicReferenceSection, REFERENCE_SECTIONS } from '../../domain/referenceSections';
import { normalizeReferenceSituations } from '../../domain/referenceSituationAdapter';
import { MOCK_SITUATIONS } from '../data/situationsData';
import { mockScenarioManager } from './mockScenario';

export interface IReferenceService {
  getSections(): Promise<ReferenceSection[]>;
  getSituations(sectionId?: ReferenceSectionId | 'all'): Promise<ReferenceSituation[]>;
  getSituationBySlug(slug: string): Promise<ReferenceSituation | null>;
  getUpdatedSituations(limit?: number): Promise<ReferenceSituation[]>;
}

const situations = normalizeReferenceSituations(MOCK_SITUATIONS)
  .filter((situation) => isPublicReferenceSection(situation.sectionId));

export class MockReferenceService implements IReferenceService {
  async getSections(): Promise<ReferenceSection[]> {
    return mockScenarioManager.simulateRequest([...REFERENCE_SECTIONS], []);
  }

  async getSituations(sectionId: ReferenceSectionId | 'all' = 'all'): Promise<ReferenceSituation[]> {
    const data = sectionId === 'all'
      ? situations
      : situations.filter((situation) => situation.sectionId === sectionId);
    return mockScenarioManager.simulateRequest(data, []);
  }

  async getSituationBySlug(slug: string): Promise<ReferenceSituation | null> {
    return mockScenarioManager.simulateRequest(
      situations.find((situation) => situation.slug === slug) ?? null,
      null,
    );
  }

  async getUpdatedSituations(limit = 4): Promise<ReferenceSituation[]> {
    return mockScenarioManager.simulateRequest(situations.slice(0, limit), []);
  }
}

export const referenceService = new MockReferenceService();

export { REFERENCE_SECTIONS, getReferenceSection, getReferenceTopic } from '../../domain/referenceSections';
