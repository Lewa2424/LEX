/**
 * @fileoverview Пошук по готових відповідях, бланках і термінах LEX.
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useServices } from '../../app/providers/ServiceProvider';
import { MaterialType, ReferenceSectionId, SearchResultItem } from '../../shared/types';
import { REFERENCE_SECTIONS } from '../../domain/referenceSections';
import { StatusBanner } from '../../shared/ui/StatusBanner';
import { Skeleton } from '../../shared/ui/Skeleton';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { stripCitationServicePrefix } from '../../shared/lib/citationDisplay';
import { Search, Filter, X } from 'lucide-react';

function resultPath(item: SearchResultItem): string {
  if (item.type === 'situation' || item.type === 'citation') return `/reference/${item.slug}`;
  if (item.type === 'form') return `/forms/${item.slug}`;
  if (item.type === 'term') return `/terms/${item.slug}`;
  if (item.type === 'learning') return `/learning/${item.slug}`;
  return '/first-aid';
}

const TYPE_LABELS: Record<string, string> = {
  situation: 'Ситуація',
  citation: 'Матеріал',
  form: 'Бланк',
  term: 'Термін',
  learning: 'Навчання',
  first_aid: 'Перша допомога',
};

export const SearchPage: React.FC = () => {
  const { search } = useServices();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';

  const [queryText, setQueryText] = useState(queryFromUrl);
  const [materialType, setMaterialType] = useState<MaterialType | 'all'>('all');
  const [sectionId, setSectionId] = useState<ReferenceSectionId | 'all'>('all');

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setQueryText(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    async function executeSearch() {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await search.search({
          queryText: queryFromUrl,
          materialType,
          sectionId,
          statusFilter: 'all',
          sortBy: 'relevance',
          pageSize: 40,
        });
        setResults(res.items);
        setTotalCount(res.totalCount);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    executeSearch();
  }, [search, queryFromUrl, materialType, sectionId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = queryText.trim();
    if (q) setSearchParams({ q });
    else setSearchParams({});
  };

  const handleResetFilters = () => {
    setQueryText('');
    setMaterialType('all');
    setSectionId('all');
    setSearchParams({});
  };

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumbs items={[{ label: 'Пошук' }]} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Пошук</h1>

        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <label htmlFor="search-page-input" className="sr-only">
            Пошуковий запит
          </label>
          <Search className="absolute left-4 w-5 h-5 text-slate-400" />
          <input
            id="search-page-input"
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Наприклад: ПЛЛА, зони радіоактивного, ОПН-1, інструктаж…"
            className="w-full text-sm sm:text-base pl-12 pr-28 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-slate-100 focus:outline-none min-h-[44px]"
            autoFocus
          />
          {queryText && (
            <button
              type="button"
              onClick={() => {
                setQueryText('');
                setSearchParams({});
              }}
              aria-label="Очистити"
              className="absolute right-24 text-slate-400 hover:text-slate-600 p-2 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer min-h-[44px]"
          >
            Шукати
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Фільтр:
          </span>
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value as MaterialType | 'all')}
            className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl min-h-[44px]"
          >
            <option value="all">Усе</option>
            <option value="situation">Ситуації</option>
            <option value="form">Бланки</option>
            <option value="term">Терміни</option>
          </select>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value as ReferenceSectionId | 'all')}
            className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl min-h-[44px]"
          >
            <option value="all">Усі розділи</option>
            {REFERENCE_SECTIONS.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {queryFromUrl ? (
            <>
              За запитом «<strong>{queryFromUrl}</strong>»: <strong>{totalCount}</strong>
            </>
          ) : (
            <>
              Усього в індексі: <strong>{totalCount}</strong>
            </>
          )}
        </span>
        {(materialType !== 'all' || sectionId !== 'all' || queryFromUrl) && (
          <button type="button" onClick={handleResetFilters} className="text-sky-600 hover:underline font-medium cursor-pointer min-h-[44px]">
            Скинути
          </button>
        )}
      </div>

      {isError && (
        <StatusBanner type="warning" title="Помилка пошуку">
          Не вдалося виконати запит. Спробуйте ще раз.
        </StatusBanner>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <h2 className="text-base font-semibold">Нічого не знайдено</h2>
          <p className="text-xs text-slate-500">Спробуйте «ПЛЛА», «зони», «ОПН», «ДСНС» або назву ситуації.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((item) => {
            const snippet = stripCitationServicePrefix(item.snippet);
            return (
              <Link
                key={item.id}
                to={resultPath(item)}
                className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-sky-300 dark:hover:border-sky-700 transition-colors space-y-1.5"
              >
                <div className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wide">
                  {TYPE_LABELS[item.type] || item.type}
                </div>
                <div className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">{item.title}</div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">{snippet}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
