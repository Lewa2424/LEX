import React, { useEffect, useState } from 'react';
import { useServices } from '../../app/providers/ServiceProvider';
import { PUBLICATION_STATUS_LABELS, type PublicationStatus } from '../../domain';
import type { AdminContentKind, AdminContentRecord } from '../../infrastructure/repositories';
import { AdminLayout } from './AdminLayout';

const workflow: { status: PublicationStatus; label: string }[] = [
  { status: 'under_review', label: 'Надіслати на перевірку' },
  { status: 'published', label: 'Опублікувати' },
  { status: 'rejected', label: 'Відхилити' },
];

export const AdminContentPage: React.FC<{
  kind: AdminContentKind;
  title: string;
  description: string;
  metadataLabel?: string;
}> = ({ kind, title, description, metadataLabel }) => {
  const { content } = useServices();
  const [items, setItems] = useState<AdminContentRecord[]>([]);
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [metadata, setMetadata] = useState('');

  const reload = () => void content.list(kind).then(setItems);
  useEffect(reload, [content, kind]);

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    await content.save({
      id: crypto.randomUUID(),
      kind,
      title: name.trim(),
      summary: summary.trim(),
      status: 'draft',
      metadata: metadataLabel ? { value: metadata.trim() } : undefined,
    });
    setName('');
    setSummary('');
    setMetadata('');
    reload();
  };

  return (
    <AdminLayout>
      <section className="grid gap-5 lg:grid-cols-[minmax(260px,360px)_1fr]">
        <form onSubmit={add} className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div><h2 className="text-lg font-bold">{title}</h2><p className="mt-1 text-xs text-slate-500">{description}</p></div>
          <label className="block text-xs font-semibold">Назва<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 bg-transparent px-3" /></label>
          <label className="block text-xs font-semibold">Опис<textarea required value={summary} onChange={(event) => setSummary(event.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-slate-300 bg-transparent p-3" /></label>
          {metadataLabel && <label className="block text-xs font-semibold">{metadataLabel}<input value={metadata} onChange={(event) => setMetadata(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 bg-transparent px-3" /></label>}
          <button className="min-h-11 w-full rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white">Створити чернетку</button>
        </form>
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-xs text-slate-500">{item.summary}</p>{item.metadata?.value && <p className="mt-2 text-xs">Метадані: {item.metadata.value}</p>}</div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs dark:bg-slate-800">{PUBLICATION_STATUS_LABELS[item.status]}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {workflow.map((action) => <button key={action.status} onClick={() => void content.transition(kind, item.id, action.status).then(reload)} className="min-h-11 rounded-xl border border-slate-300 px-3 text-xs font-semibold dark:border-slate-700">{action.label}</button>)}
                <button onClick={() => void content.remove(kind, item.id).then(reload)} className="min-h-11 rounded-xl px-3 text-xs font-semibold text-rose-600">Видалити локально</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
};
