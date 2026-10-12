/** Картка терміна у стилі детальної відповіді довідника. */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useServices } from '../../app/providers/ServiceProvider';
import type { SafetyTerm } from '../../shared/types';
import { stripCitationServicePrefix } from '../../shared/lib/citationDisplay';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { Skeleton } from '../../shared/ui/Skeleton';

function isDemoOfficialUrl(url: string | undefined): boolean {
  if (!url) return true;
  try {
    const host = new URL(url).hostname;
    return host === 'example.org' || host === 'example.com' || host.endsWith('.example');
  } catch {
    return true;
  }
}

export const TermDetailPage: React.FC = () => {
  const { terms } = useServices();
  const { slug } = useParams<{ slug: string }>();
  const [term, setTerm] = useState<SafetyTerm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setIsLoading(true);
    terms.getTermBySlug(slug).then((res) => {
      if (!active) return;
      setTerm(res);
      setIsLoading(false);
    });
    return () => { active = false; };
  }, [slug, terms]);

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!term) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-xl font-bold">Термін не знайдено</h1>
        <Link to="/terms" className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:underline">
          Повернутися до глосарію
        </Link>
      </div>
    );
  }

  const explanation = stripCitationServicePrefix(term.editorialExplanation);
  const definition = stripCitationServicePrefix(term.officialDefinition);
  const showOfficialLink = !isDemoOfficialUrl(term.source.officialUrl);

  return (
    <div className="space-y-7 pb-14">
      <Breadcrumbs
        items={[
          { label: 'Терміни', path: '/terms' },
          { label: term.term },
        ]}
      />

      <article className="mx-auto max-w-4xl">
        <header className="border-b border-slate-200 pb-7 dark:border-slate-800">
          <div className="mb-5">
            <Link
              to="/terms"
              className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" /> До глосарію
            </Link>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
            Термін
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {term.term}
          </h1>
          {term.synonyms.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Також:</span>
              {term.synonyms.map((syn) => (
                <span
                  key={syn}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  {syn}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="divide-y divide-slate-200 border-b border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          <section className="grid gap-4 py-7 sm:grid-cols-[3.5rem_1fr] sm:py-9">
            <div className="relative flex justify-center">
              <span className="relative z-10 grid h-7 w-7 place-items-center rounded-full border border-indigo-200 bg-white text-[11px] font-bold tabular-nums text-indigo-600 dark:border-indigo-900 dark:bg-slate-950 dark:text-indigo-300">
                1
              </span>
              <span aria-hidden="true" className="absolute top-7 bottom-[-2.25rem] w-px bg-indigo-100 dark:bg-indigo-950" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white sm:text-xl">Пояснення</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{explanation}</p>
            </div>
          </section>

          <section className="grid gap-4 py-7 sm:grid-cols-[3.5rem_1fr] sm:py-9">
            <div className="flex justify-center">
              <span className="grid h-7 w-7 place-items-center rounded-full border border-indigo-200 bg-white text-[11px] font-bold tabular-nums text-indigo-600 dark:border-indigo-900 dark:bg-slate-950 dark:text-indigo-300">
                2
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white sm:text-xl">Визначення</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
                «{definition}»
              </p>
              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                Джерело (на перевірку): {term.source.title}
                {term.sectionOrArticle ? ` · ${term.sectionOrArticle}` : ''}
                {showOfficialLink && term.source.officialUrl ? (
                  <>
                    {' · '}
                    <a
                      href={term.source.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Відкрити джерело
                    </a>
                  </>
                ) : null}
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};
