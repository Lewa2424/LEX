/** Детальна відповідь на конкретну ситуацію без фіксованих етапів і публічних джерел. */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Bookmark, BookmarkCheck, Clock, UserCheck } from 'lucide-react';
import { useServices } from '../../app/providers/ServiceProvider';
import { getReferenceSection, getReferenceTopic } from '../../domain/referenceSections';
import type { ReferenceSituation } from '../../shared/types';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { Button } from '../../shared/ui/Button';
import { Skeleton } from '../../shared/ui/Skeleton';
import { citationTextToBlocks } from '../../shared/lib/citationDisplay';

export const SituationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { reference, favorites } = useServices();
  const [situation, setSituation] = useState<ReferenceSituation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    reference.getSituationBySlug(slug).then((item) => {
      if (!active) return;
      setSituation(item);
      if (item) favorites.isFavorite(item.id).then((value) => active && setIsFavorite(value));
      setIsLoading(false);
    });
    return () => { active = false; };
  }, [favorites, reference, slug]);

  if (isLoading) return <div className="space-y-5"><Skeleton className="h-8 w-72" /><Skeleton className="h-40 w-full" /><Skeleton className="h-64 w-full" /></div>;

  if (!situation) return (
    <div className="py-16 text-center">
      <h1 className="text-xl font-bold">Ситуацію не знайдено</h1>
      <Link to="/reference" className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:underline">Повернутися до довідника</Link>
    </div>
  );

  const section = getReferenceSection(situation.sectionId);
  const topic = getReferenceTopic(situation.topicId);

  const toggleFavorite = async () => {
    if (isFavorite) await favorites.removeFavorite(situation.id);
    else await favorites.addFavorite({ targetId: situation.id, type: 'situation', title: situation.title, slug: situation.slug, summary: situation.summary });
    setIsFavorite((value) => !value);
  };

  return (
    <div className="space-y-7 pb-14">
      <Breadcrumbs items={[
        { label: 'Довідник', path: '/reference' },
        ...(section ? [{ label: section.title, path: '/reference' as const }] : []),
        ...(topic ? [{ label: topic.title, path: '/reference' as const }] : []),
        { label: situation.title },
      ]} />

      <article className="mx-auto max-w-4xl">
        <header className="border-b border-slate-200 pb-7 dark:border-slate-800">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link to="/reference" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600">
              <ArrowLeft className="h-4 w-4" /> До карти питань
            </Link>
            <Button variant={isFavorite ? 'secondary' : 'outline'} size="sm" onClick={toggleFavorite} icon={isFavorite ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}>
              {isFavorite ? 'Збережено' : 'Зберегти'}
            </Button>
          </div>
          {topic && <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">{topic.title}</p>}
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl">{situation.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{situation.summary}</p>
        </header>

        {situation.keyAttentionPoints.length > 0 && (
          <aside className="my-7 rounded-xl border-l-4 border-amber-500 bg-amber-50 px-5 py-4 dark:bg-amber-950/25">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200"><AlertTriangle className="h-4 w-4" /> Зверніть увагу</div>
            <ul className="mt-3 space-y-2 pl-5 text-sm text-amber-950 dark:text-amber-100">
              {situation.keyAttentionPoints.map((point) => <li key={point} className="list-disc">{point}</li>)}
            </ul>
          </aside>
        )}

        <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {situation.answers.map((answer, index) => {
            const blocks = citationTextToBlocks(answer.content);
            return (
              <section key={answer.id} className="grid gap-4 py-7 sm:grid-cols-[3.5rem_1fr] sm:py-9">
                <div className="relative flex justify-center">
                  <span className="relative z-10 grid h-7 w-7 place-items-center rounded-full border border-indigo-200 bg-white text-[11px] font-bold tabular-nums text-indigo-600 dark:border-indigo-900 dark:bg-slate-950 dark:text-indigo-300">
                    {index + 1}
                  </span>
                  {index < situation.answers.length - 1 && (
                    <span aria-hidden="true" className="absolute top-7 bottom-[-2.25rem] w-px bg-indigo-100 dark:bg-indigo-950" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white sm:text-xl">{answer.title}</h2>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                    {blocks.map((block, blockIndex) => block.type === 'ul' ? (
                      <ul key={blockIndex} className="space-y-2 pl-5">{block.items.map((item) => <li key={item} className="list-disc">{item}</li>)}</ul>
                    ) : block.type === 'h' ? (
                      <h3 key={blockIndex} className="pt-2 font-bold text-slate-900 dark:text-slate-100">{block.text}</h3>
                    ) : <p key={blockIndex}>{block.text}</p>)}
                  </div>
                  {(answer.responsibleRole || answer.deadlineText) && (
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
                      {answer.responsibleRole && <span className="inline-flex items-center gap-2"><UserCheck className="h-4 w-4 text-indigo-500" />{answer.responsibleRole}</span>}
                      {answer.deadlineText && <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-indigo-500" />{answer.deadlineText}</span>}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </article>
    </div>
  );
};
