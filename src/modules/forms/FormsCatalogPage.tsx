/**
 * @fileoverview Каталог бланков, журналов и шаблонов документов по охране труда.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useServices } from '../../app/providers/ServiceProvider';
import { DocumentForm } from '../../shared/types';
import { Badge } from '../../shared/ui/Badge';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { Skeleton } from '../../shared/ui/Skeleton';
import { FileText, Search, Download, FileCode, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Усі бланки' },
  { id: 'briefings', label: 'Інструктажі' },
  { id: 'permits', label: 'Наряди-допуски' },
  { id: 'incidents', label: 'Нещасні випадки' },
  { id: 'risks', label: 'ЗІЗ і ризики' },
  { id: 'audit', label: 'Оцінка факторів і аудит' },
];

/**
 * Каталог бланков документов по охране труда.
 */
export const FormsCatalogPage: React.FC = () => {
  const { forms: formsService } = useServices();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [queryText, setQueryText] = useState('');
  const [forms, setForms] = useState<DocumentForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchForms() {
      setIsLoading(true);
      const res = await formsService.getForms(selectedCategory, queryText);
      setForms(res);
      setIsLoading(false);
    }
    fetchForms();
  }, [formsService, selectedCategory, queryText]);

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumbs items={[{ label: 'Бланки документів і журнали' }]} />

      {/* Шапка каталога */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
          <FileText className="w-5 h-5" />
          <span>Готові шаблони Salus</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Каталог бланків, журналів і актів з охорони праці
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Актуальні шаблони документів із правилами оформлення, зазначенням відповідальних і посиланнями на НПА.
        </p>
      </div>

      {/* Поиск и категории */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Пошук бланка або журналу..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-1.5 w-full py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Список бланков */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : forms.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
          Бланків за обраним фільтром не знайдено.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-xs space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <Badge status={form.status} size="sm" />
                  <span className="text-slate-400">Версія {form.version}</span>
                </div>

                <Link
                  to={`/forms/${form.slug}`}
                  className="font-bold text-base text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block"
                >
                  {form.title}
                </Link>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {form.description}
                </p>

                <div className="text-[11px] text-slate-400 pt-1">
                  Підстава: <strong className="text-slate-700 dark:text-slate-300">{form.legalBasis}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  {form.formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/forms/${form.slug}`}
                  className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  Відкрити бланк
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
