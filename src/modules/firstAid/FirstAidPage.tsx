/**
 * @fileoverview Раздел «Первая помощь на производстве».
 * Содержит экстренные алгоритмы действий, недопустимые действия и медицинские предупреждения.
 */

import React, { useState, useEffect } from 'react';
import { useServices } from '../../app/providers/ServiceProvider';
import { FirstAidArticle } from '../../shared/types';
import { StatusBanner } from '../../shared/ui/StatusBanner';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { Skeleton } from '../../shared/ui/Skeleton';
import { HeartPulse, AlertOctagon, CheckCircle2, ShieldAlert, PhoneCall } from 'lucide-react';

/** Все категории первой помощи. */
const CATEGORIES = [
  { id: 'all', label: 'Усі екстрені теми' },
  { id: 'combat', label: 'Бойові дії / воєнний стан' },
  { id: 'assessment', label: 'Базові дії' },
  { id: 'breathing', label: 'Свідомість, дихання, СЛР' },
  { id: 'bleeding', label: 'Кровотечі та шок' },
  { id: 'trauma', label: 'Травми' },
  { id: 'burns', label: 'Термічні й хімічні ураження' },
  { id: 'electrocution', label: 'Електротравма' },
  { id: 'cold', label: 'Холод і перегрівання' },
  { id: 'poisoning', label: 'Отруєння та газ' },
  { id: 'water', label: 'Утоплення' },
  { id: 'acute', label: 'Гострі стани' },
];

/**
 * Главная страница раздела Первая помощь.
 */
export const FirstAidPage: React.FC = () => {
  const { firstAid } = useServices();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [articles, setArticles] = useState<FirstAidArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<FirstAidArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка алгоритмов первой помощи
  useEffect(() => {
    async function fetchArticles() {
      setIsLoading(true);
      const res = await firstAid.getArticles(selectedCategory);
      setArticles(res);
      if (res.length > 0) {
        setSelectedArticle((current) => current ?? res[0]);
      }
      setIsLoading(false);
    }
    fetchArticles();
  }, [firstAid, selectedCategory]);

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Перша допомога на виробництві' }]} />

      {/* Экстренное предупреждение */}
      <div className="bg-rose-600 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <PhoneCall className="w-6 h-6 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1">
            <h2 className="font-bold text-base sm:text-lg">Екстрений виклик швидкої допомоги: 112 або 103</h2>
            <p className="text-xs text-rose-100 opacity-90">
              За загрози життю викликайте 112 або 103 одразу: доручіть виклик іншому або телефонуйте на гучному зв’язку, не перериваючи зупинку критичної кровотечі.
            </p>
          </div>
        </div>
      </div>

      <StatusBanner type="warning" title="Медичне попередження">
        Матеріал дає алгоритми для перших хвилин до прибуття бригади. Вказівки диспетчера 103/112 та допомога медиків мають пріоритет; практичне відпрацювання навичок підвищує безпеку їх виконання.
      </StatusBanner>

      {/* Фильтр по категориям */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSelectedArticle(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-rose-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Основная сетка карточек первой помощи */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Немає опублікованих матеріалів
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Чернетки алгоритмів доступні лише в редакційній панелі після підтвердження медичної відповідальності.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка с карточками */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Алгоритми за темою</h3>
            {articles.map((art) => (
              <button
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedArticle?.id === art.id
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 dark:border-rose-800 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">{art.title}</div>
                <div className="text-xs text-slate-500 line-clamp-2">{art.shortSummary}</div>
              </button>
            ))}
          </div>

          {/* Правая колонка с детальным алгоритмом */}
          <div className="lg:col-span-2">
            {selectedArticle ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                    <span>Ревізія: {selectedArticle.medicalRevisionDate}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedArticle.title}
                  </h2>
                </div>

                {/* Обязательные шаги */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Дійте негайно:</span>
                  </h3>
                  <ol className="space-y-2">
                    {selectedArticle.emergencySteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {selectedArticle.instructionBlocks.map((block) => (
                  <section key={block.title} className="space-y-3 pt-1">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{block.title}</h3>
                    <ul className="space-y-2">
                      {block.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}

                {/* Запрещенные действия */}
                {selectedArticle.prohibitedActions.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-bold text-sm text-rose-800 dark:text-rose-300 flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                      <span>КАТЕГОРИЧНО ЗАБОРОНЕНО:</span>
                    </h3>
                    <ul className="space-y-2">
                      {selectedArticle.prohibitedActions.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-rose-900 dark:text-rose-200 bg-rose-50/80 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-200 dark:border-rose-800/80">
                          <span className="font-bold text-rose-600">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
                Оберіть алгоритм першої допомоги зі списку зліва.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
