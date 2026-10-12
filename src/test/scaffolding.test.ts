import { describe, expect, it } from 'vitest';
import {
  canOpenAdmin,
  normalizeReferenceSituations,
  PUBLICATION_STATUSES,
  REFERENCE_SECTIONS,
  STANDALONE_MODULE_SECTION_IDS,
} from '../domain';
import { DisabledSemanticSearchAdapter } from '../infrastructure/search/SemanticSearchAdapter';
import { MOCK_SITUATIONS } from '../mocks/data/situationsData';

describe('Stages 2–9 scaffolding contracts', () => {
  it('keeps the complete publication lifecycle', () => {
    expect(PUBLICATION_STATUSES).toEqual([
      'draft',
      'under_review',
      'published',
      'needs_review',
      'archived',
      'rejected',
    ]);
  });

  it('does not grant admin UI access to guests or users', () => {
    expect(canOpenAdmin('guest')).toBe(false);
    expect(canOpenAdmin('user')).toBe(false);
    expect(canOpenAdmin('editor')).toBe(true);
    expect(canOpenAdmin('medical_reviewer')).toBe(true);
  });

  it('keeps semantic search explicitly disabled', async () => {
    const adapter = new DisabledSemanticSearchAdapter();
    await expect(adapter.search({ queryText: 'ризик' })).rejects.toMatchObject({ code: 'NOT_ENABLED' });
  });

  it('keeps 17 unique reference sections and routes duplicate content to dedicated modules', () => {
    const topicIds = REFERENCE_SECTIONS.flatMap((section) => section.topics.map((topic) => topic.id));

    expect(REFERENCE_SECTIONS).toHaveLength(17);
    expect(STANDALONE_MODULE_SECTION_IDS).toEqual(['documents_records', 'first_aid']);
    expect(REFERENCE_SECTIONS.some((section) => section.id === 'documents_records')).toBe(false);
    expect(REFERENCE_SECTIONS.some((section) => section.id === 'first_aid')).toBe(false);
    expect(new Set(topicIds).size).toBe(topicIds.length);
  });

  it('sorts topics alphabetically within each section (uk locale)', () => {
    for (const section of REFERENCE_SECTIONS) {
      const titles = section.topics.map((topic) => topic.title);
      const sorted = [...titles].sort((a, b) => a.localeCompare(b, 'uk'));
      expect(titles).toEqual(sorted);
    }
  });

  it('converts legacy content into dynamic answers without public source labels', () => {
    const situations = normalizeReferenceSituations(MOCK_SITUATIONS);
    const visibleText = situations
      .flatMap((situation) => [
        situation.summary,
        ...situation.answers.flatMap((answer) => [answer.title, answer.content]),
      ])
      .join(' ');

    expect(situations.length).toBeGreaterThan(0);
    expect(situations.every((situation) => situation.answers.length > 0)).toBe(true);
    expect(visibleText).not.toMatch(/лекц(?:ія|ії|ією)?\s+\d+\s+предмета/iu);
    expect(visibleText).not.toMatch(/цитата з архівної лекції/iu);
  });
});
