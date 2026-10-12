/** Алфавітний каталог термінів у стилі довідника LEX. */
import React, { useDeferredValue, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { useServices } from '../../app/providers/ServiceProvider';
import type { SafetyTerm } from '../../shared/types';
import { stripCitationServicePrefix } from '../../shared/lib/citationDisplay';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { Skeleton } from '../../shared/ui/Skeleton';

export const TermsCatalogPage: React.FC = () => {
  const { terms: termsService } = useServices();
  const [alphabet, setAlphabet] = useState<string[]>([]);
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [queryText, setQueryText] = useState('');
  const deferredQuery = useDeferredValue(queryText);
  const [terms, setTerms] = useState<SafetyTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    termsService.getAlphabet().then((alpha) => {
      if (active) setAlphabet(alpha);
    });
    return () => { active = false; };
  }, [termsService]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    termsService.getTerms(selectedLetter, deferredQuery).then((res) => {
      if (!active) return;
      setTerms(res);
      setIsLoading(false);
    });
    return () => { active = false; };
  }, [termsService, selectedLetter, deferredQuery]);

  return (
    <div className="space-y-7 pb-12">
      <Breadcrumbs items={[{ label: 'Терміни' }]} />

      <header className="grid gap-5 border-b border-slate-200 pb-7 dark:border-slate-800 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            Глосарій
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Терміни з охорони праці
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Короткі пояснення понять, з якими стикаються на підприємстві. Визначення потребують звірки з чинними джерелами.
          </p>
        </div>
        <label className="relative block">
          <span className="sr-only">Пошук у глосарії</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={queryText}
            onChange={(event) => setQueryText(event.target.value)}
            placeholder="Наприклад: ЗІЗ, ризик, інструктаж"
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>
      </header>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Алфавітний фільтр">
        <button
          type="button"
          onClick={() => setSelectedLetter('all')}
          className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-xl px-3 text-xs font-bold transition-colors ${
            selectedLetter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          Усі
        </button>
        {alphabet.map((letter) => (
          <button
            type="button"
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-xl px-2.5 text-xs font-bold transition-colors ${
              selectedLetter === letter
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : terms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Термінів не знайдено</h2>
          <p className="mt-2 text-sm text-slate-500">Спробуйте іншу літеру або коротший запит.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <ul className="m-0 list-none divide-y divide-slate-100 p-0 dark:divide-slate-800">
            {terms.map((term) => (
              <li key={term.id}>
                <Link
                  to={`/terms/${term.slug}`}
                  className="group flex gap-4 px-5 py-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 sm:px-6"
                >
                  <span className="mt-0.5 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {term.firstLetter}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-300">
                      {term.term}
                    </span>
                    <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {stripCitationServicePrefix(term.editorialExplanation)}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
