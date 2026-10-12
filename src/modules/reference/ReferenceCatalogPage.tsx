/** Каталог нового довідника: розділ → підрозділ → ситуація. */
import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Search } from 'lucide-react';
import { useServices } from '../../app/providers/ServiceProvider';
import type { ReferenceSection, ReferenceSituation } from '../../shared/types';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { Skeleton } from '../../shared/ui/Skeleton';

export const ReferenceCatalogPage: React.FC = () => {
  const { reference } = useServices();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase('uk-UA'));
  const [sections, setSections] = useState<ReferenceSection[]>([]);
  const [situations, setSituations] = useState<ReferenceSituation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set());
  const [openTopics, setOpenTopics] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let active = true;
    Promise.all([reference.getSections(), reference.getSituations('all')]).then(([nextSections, nextSituations]) => {
      if (!active) return;
      setSections(nextSections);
      setSituations(nextSituations);
      setIsLoading(false);
    });
    return () => { active = false; };
  }, [reference]);

  const catalog = useMemo(() => sections.map((section) => {
    const sectionMatches = section.title.toLocaleLowerCase('uk-UA').includes(deferredQuery);
    const topics = section.topics.map((topic) => {
      const topicMatches = topic.title.toLocaleLowerCase('uk-UA').includes(deferredQuery);
      const items = situations.filter((situation) => {
        if (situation.topicId !== topic.id) return false;
        if (!deferredQuery || sectionMatches || topicMatches) return true;
        return `${situation.title} ${situation.summary} ${situation.answers.map((answer) => `${answer.title} ${answer.content}`).join(' ')}`
          .toLocaleLowerCase('uk-UA')
          .includes(deferredQuery);
      });
      return { topic, items, visible: !deferredQuery || sectionMatches || topicMatches || items.length > 0 };
    }).filter((entry) => entry.visible);
    return { section, topics, visible: !deferredQuery || sectionMatches || topics.length > 0 };
  }).filter((entry) => entry.visible), [deferredQuery, sections, situations]);

  useEffect(() => {
    if (!deferredQuery) return;
    setOpenSections(new Set(catalog.map(({ section }) => section.id)));
    setOpenTopics(new Set(catalog.flatMap(({ topics }) => topics.map(({ topic }) => topic.id))));
  }, [catalog, deferredQuery]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) => {
    setter((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-7 pb-12">
      <Breadcrumbs items={[{ label: 'Довідник' }]} />

      <header className="grid gap-5 border-b border-slate-200 pb-7 dark:border-slate-800 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">Карта робочих питань</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Знайдіть свою ситуацію</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Оберіть сферу, уточніть тему та відкрийте готову відповідь.
          </p>
        </div>
        <label className="relative block">
          <span className="sr-only">Пошук у довіднику</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Наприклад: повторний інструктаж"
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>
      </header>

      {isLoading ? (
        <div className="space-y-3"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
      ) : catalog.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
          <h2 className="font-semibold">Такої теми поки немає</h2>
          <p className="mt-2 text-sm text-slate-500">Спробуйте коротшу назву дії, документа або небезпеки.</p>
        </div>
      ) : (
        <ol className="m-0 list-none space-y-3 p-0">
          {catalog.map(({ section, topics }) => {
            const sectionOpen = openSections.has(section.id);
            const situationCount = topics.reduce((count, entry) => count + entry.items.length, 0);
            return (
              <li key={section.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <button
                  type="button"
                  aria-expanded={sectionOpen}
                  onClick={() => toggle(setOpenSections, section.id)}
                  className="grid w-full cursor-pointer grid-cols-[3.25rem_1fr_auto] items-start gap-3 px-4 py-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:px-6"
                >
                  <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">{String(section.order).padStart(2, '0')}</span>
                  <span className="min-w-0">
                    <span className="block font-bold text-slate-950 dark:text-white sm:text-lg">{section.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-500 sm:text-sm">{section.summary}</span>
                    <span className="mt-2 block text-[11px] font-medium text-slate-400">{topics.length} підрозділів · {situationCount} готових ситуацій</span>
                  </span>
                  <ChevronDown className={`mt-1 h-5 w-5 text-slate-400 transition-transform ${sectionOpen ? 'rotate-180' : ''}`} />
                </button>

                {sectionOpen && (
                  <div className="border-t border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/30">
                    {topics.map(({ topic: topicItem, items }) => {
                      const topicOpen = openTopics.has(topicItem.id);
                      return (
                        <div key={topicItem.id} className="border-b border-slate-200 last:border-b-0 dark:border-slate-800">
                          <button
                            type="button"
                            aria-expanded={topicOpen}
                            onClick={() => toggle(setOpenTopics, topicItem.id)}
                            className="flex min-h-12 w-full cursor-pointer items-center gap-3 px-5 py-3 text-left hover:bg-white dark:hover:bg-slate-900 sm:pl-[5.75rem] sm:pr-6"
                          >
                            <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${topicOpen ? 'rotate-180' : ''}`} />
                            <span className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{topicItem.title}</span>
                            <span className="text-xs tabular-nums text-slate-400">{items.length}</span>
                          </button>
                          {topicOpen && (
                            <div className="bg-white dark:bg-slate-900">
                              {items.length === 0 ? (
                                <p className="px-6 py-4 text-xs text-slate-400 sm:pl-[8.25rem]">Матеріал для цього підрозділу ще не розкладено.</p>
                              ) : (
                                <ul className="m-0 list-none divide-y divide-slate-100 p-0 dark:divide-slate-800">
                                  {items.map((situation) => (
                                    <li key={situation.id}>
                                      <Link to={`/reference/${situation.slug}`} className="group flex gap-4 px-6 py-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 sm:pl-[8.25rem]">
                                        <span className="min-w-0 flex-1">
                                          <span className="block text-sm font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-300">{situation.title}</span>
                                          <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-slate-500">{situation.summary}</span>
                                        </span>
                                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
