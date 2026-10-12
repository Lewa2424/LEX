/**
 * @fileoverview Детальная страница бланка или журнала.
 * Содержит описание правил применения, превью и демо-кнопки скачивания PDF/DOCX.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useServices } from '../../app/providers/ServiceProvider';
import { DocumentForm } from '../../shared/types';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { Skeleton } from '../../shared/ui/Skeleton';
import { Download, FileText, UserCheck, Clock, ShieldCheck, Eye } from 'lucide-react';

/**
 * Детальная страница бланка.
 */
export const FormDetailPage: React.FC = () => {
  const { forms } = useServices();
  const { slug } = useParams<{ slug: string }>();
  const [form, setForm] = useState<DocumentForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForm() {
      if (!slug) return;
      setIsLoading(true);
      const res = await forms.getFormBySlug(slug);
      setForm(res);
      setIsLoading(false);
    }
    fetchForm();
  }, [forms, slug]);

  /** Имитация скачивания файла */
  const handleDownloadDemo = (format: string) => {
    setDownloadMsg(`Завантаження файлу ${format} буде доступне після підключення сховища документів.`);
    setTimeout(() => setDownloadMsg(null), 3500);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold">Бланк документа не знайдено</h2>
        <Link to="/forms" className="text-sky-600 hover:underline text-sm font-medium">
          Повернутися до каталогу бланків
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs
        items={[
          { label: 'Бланки', path: '/forms' },
          { label: form.title },
        ]}
      />

      {/* Основная карточка бланка */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Badge status={form.status} />
            <span className="text-xs text-slate-400">Версія бланка: {form.version}</span>
          </div>

          <div className="flex items-center gap-2">
            {form.formats.map((fmt) => (
              <Button
                key={fmt}
                variant="outline"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={() => handleDownloadDemo(fmt)}
              >
                Завантажити {fmt}
              </Button>
            ))}
          </div>
        </div>

        {downloadMsg && (
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 text-xs rounded-xl border border-sky-200 animate-fadeIn">
            {downloadMsg}
          </div>
        )}

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          {form.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {form.description}
        </p>

        {/* Таблица метаданных */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-sky-500" /> Хто оформлює:
            </span>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{form.responsibleRole}</div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Регламентований строк:
            </span>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{form.duePeriodText}</div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Правова підстава:
            </span>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{form.legalBasis}</div>
          </div>
        </div>

        {/* Превью бланка */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-sky-500" /> Зразок і попередній перегляд форми
          </h3>
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-8 bg-slate-50/50 dark:bg-slate-950/50 text-center space-y-3 font-serif">
            <div className="max-w-md mx-auto space-y-2 text-xs text-slate-500 border-b pb-4 border-slate-200 dark:border-slate-800">
              <div className="text-right font-sans">Додаток до наказу {form.legalBasis}</div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase">{form.title}</div>
            </div>
            <div className="py-8 text-slate-400 text-xs italic">
              [Попередній перегляд офіційного бланка документа • Версія {form.version}]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
