import { Link } from 'react-router-dom';
import { MOCK_SITUATIONS } from '../../mocks/data/situationsData';
import { normalizeReferenceSituations } from '../../domain/referenceSituationAdapter';
import { AdminLayout } from './AdminLayout';

const situations = normalizeReferenceSituations(MOCK_SITUATIONS);

export const AdminSituationsPage = () => (
  <AdminLayout>
    <section className="space-y-4">
      <div><h2 className="text-xl font-bold">Робочі ситуації</h2><p className="text-xs text-slate-500">Локальні mock-ситуації. Твердження та строки не є перевіреними нормативними вимогами.</p></div>
      <div className="grid gap-3 md:grid-cols-2">
        {situations.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold">{item.title}</h3>
            <p className="mt-2 line-clamp-2 text-xs text-slate-500">{item.summary}</p>
            <Link to={`/admin/situations/${item.slug}`} className="mt-3 inline-flex min-h-11 items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">Редагувати відповідь</Link>
          </article>
        ))}
      </div>
    </section>
  </AdminLayout>
);
