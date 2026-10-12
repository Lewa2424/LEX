import type { ISearchService } from '../../mocks/services/SearchService';
import { searchService } from '../../mocks/services/SearchService';

/** Поточний лексичний адаптер делегує запити наявному mock-пошуку. */
export class LexicalSearchAdapter implements ISearchService {
  search = searchService.search.bind(searchService);
  getSuggestions = searchService.getSuggestions.bind(searchService);
}

export const lexicalSearchAdapter = new LexicalSearchAdapter();
