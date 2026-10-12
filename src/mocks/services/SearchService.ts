/** Пошук по готових відповідях нового довідника, формах і термінах. */
import type { SearchQuery, SearchResultItem, SearchResultPage, SearchSuggestion } from '../../shared/types';
import { normalizeReferenceSituations } from '../../domain/referenceSituationAdapter';
import { isPublicReferenceSection } from '../../domain/referenceSections';
import { MOCK_SITUATIONS } from '../data/situationsData';
import { MOCK_FORMS } from '../data/formsData';
import { MOCK_TERMS } from '../data/termsData';
import { stripCitationServicePrefix } from '../../shared/lib/citationDisplay';
import { mockScenarioManager } from './mockScenario';

export interface ISearchService {
  getSuggestions(query: string): Promise<SearchSuggestion[]>;
  search(query: SearchQuery): Promise<SearchResultPage>;
}

const situations = normalizeReferenceSituations(MOCK_SITUATIONS)
  .filter((situation) => isPublicReferenceSection(situation.sectionId));

function corpus(): SearchResultItem[] {
  return [
    ...situations.map((situation) => ({
      id: `sit-${situation.id}`,
      title: situation.title,
      type: 'situation' as const,
      slug: situation.slug,
      snippet: `${situation.summary} ${situation.answers.map((answer) => `${answer.title} ${answer.content}`).join(' ')}`.slice(0, 520),
      sectionId: situation.sectionId,
      status: situation.status,
      verificationDate: situation.lastCheckDate,
      matchType: 'exact' as const,
    })),
    ...MOCK_FORMS.map((form) => ({
      id: `form-${form.id}`, title: form.title, type: 'form' as const, slug: form.slug,
      snippet: form.description || form.legalBasis, status: form.status,
      verificationDate: form.verificationDate, matchType: 'exact' as const,
    })),
    ...MOCK_TERMS.map((term) => ({
      id: `term-${term.id}`, title: term.term, type: 'term' as const, slug: term.slug,
      snippet: stripCitationServicePrefix(term.editorialExplanation || term.officialDefinition),
      status: 'under_review' as const, verificationDate: term.source.verificationDate, matchType: 'exact' as const,
    })),
  ];
}

const suggestions: SearchSuggestion[] = [
  ...situations.flatMap((situation) => [
    { id: `sug-${situation.id}`, title: situation.title, type: 'situation' as const, slug: situation.slug, contextSnippet: 'Ситуація' },
    ...situation.answers.map((answer) => ({ id: `sug-${answer.id}`, title: answer.title, type: 'situation' as const, slug: situation.slug, contextSnippet: situation.title.slice(0, 42) })),
  ]),
  ...MOCK_FORMS.map((form) => ({ id: `sug-form-${form.id}`, title: form.title, type: 'form' as const, slug: form.slug, contextSnippet: 'Бланк' })),
  ...MOCK_TERMS.map((term) => ({ id: `sug-term-${term.id}`, title: term.term, type: 'term' as const, slug: term.slug, contextSnippet: 'Термін' })),
];

export class MockSearchService implements ISearchService {
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    const needle = query.trim().toLocaleLowerCase('uk-UA');
    const data = needle ? suggestions.filter((item) => `${item.title} ${item.contextSnippet}`.toLocaleLowerCase('uk-UA').includes(needle)).slice(0, 12) : [];
    return mockScenarioManager.simulateRequest(data, []);
  }

  async search(query: SearchQuery): Promise<SearchResultPage> {
    const needle = query.queryText.trim().toLocaleLowerCase('uk-UA');
    let filtered = corpus().filter((item) => {
      if (needle && !`${item.title} ${item.snippet}`.toLocaleLowerCase('uk-UA').includes(needle)) return false;
      if (query.materialType && query.materialType !== 'all' && item.type !== query.materialType) return false;
      if (query.sectionId && query.sectionId !== 'all' && item.sectionId !== query.sectionId) return false;
      if (query.statusFilter && query.statusFilter !== 'all' && item.status !== query.statusFilter) return false;
      return true;
    });

    if (query.sortBy === 'date') filtered = [...filtered].sort((a, b) => b.verificationDate.localeCompare(a.verificationDate));
    else if (query.sortBy === 'title') filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'uk'));
    else if (needle) filtered = [...filtered].sort((a, b) => Number(!a.title.toLocaleLowerCase('uk-UA').includes(needle)) - Number(!b.title.toLocaleLowerCase('uk-UA').includes(needle)));

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const totalCount = filtered.length;
    const result: SearchResultPage = {
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      totalCount,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
      queryText: query.queryText,
    };
    return mockScenarioManager.simulateRequest(result, { ...result, items: [], totalCount: 0, totalPages: 1 });
  }
}

export const searchService = new MockSearchService();
