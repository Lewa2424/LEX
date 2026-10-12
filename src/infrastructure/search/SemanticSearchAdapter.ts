import type { SearchQuery, SearchResultPage } from '../../shared/types';
import { AppError } from '../../shared/errors/AppError';

export interface SemanticSearchAdapter {
  search(query: SearchQuery): Promise<SearchResultPage>;
}

/** Semantic search заблокований до окремого погодження власника. */
export class DisabledSemanticSearchAdapter implements SemanticSearchAdapter {
  async search(query: SearchQuery): Promise<SearchResultPage> {
    if (!query.queryText.trim()) {
      return { items: [], totalCount: 0, currentPage: 1, totalPages: 1, queryText: '' };
    }
    throw new AppError('NOT_ENABLED', 'Семантичний пошук не ввімкнено.');
  }
}
