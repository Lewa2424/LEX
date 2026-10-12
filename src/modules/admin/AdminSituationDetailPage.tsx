import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { normalizeReferenceSituations } from '../../domain/referenceSituationAdapter';
import { MOCK_SITUATIONS } from '../../mocks/data/situationsData';
import type { ReferenceSituation } from '../../shared/types';
import { AdminLayout } from './AdminLayout';

const situations = normalizeReferenceSituations(MOCK_SITUATIONS);

export const AdminSituationDetailPage = () => {
  const { slug } = useParams();
  const original = situations.find((item) => item.slug === slug);
  const [draft, setDraft] = useState<ReferenceSituation | null>(() => original ? structuredClone(original) : null);
  if (!draft) return <AdminLayout><p>Ситуацію не знайдено.</p></AdminLayout>;

  return (
    <AdminLayout>
      <section className="space-y-5">
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-xs text-indigo-950 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-100">Редактор працює з блоками відповіді ситуації.</div>
        <label className="block text-xs font-semibold">Назва<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 bg-transparent px-3" /></label>
        <label className="block text-xs font-semibold">Короткий опис<textarea value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} className="mt-1 min-h-24 w-full rounded-xl border border-slate-300 bg-transparent p-3" /></label>
        <div className="space-y-3">
          {draft.answers.map((answer, index) => (
            <article key={answer.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <label className="block text-xs font-semibold">Заголовок блоку<input value={answer.title} onChange={(event) => setDraft({ ...draft, answers: draft.answers.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-transparent px-3" /></label>
              <label className="mt-3 block text-xs font-semibold">Відповідь<textarea value={answer.content} onChange={(event) => setDraft({ ...draft, answers: draft.answers.map((item, itemIndex) => itemIndex === index ? { ...item, content: event.target.value } : item) })} className="mt-1 min-h-36 w-full rounded-lg border border-slate-300 bg-transparent p-3" /></label>
            </article>
          ))}
        </div>
        <button type="button" className="min-h-11 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white">Зберегти локальну чернетку</button>
      </section>
    </AdminLayout>
  );
};
