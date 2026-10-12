/**
 * @fileoverview Страница детального изучения конкретной темы по охране труда.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useServices } from '../../app/providers/ServiceProvider';
import { LearningTopic } from '../../shared/types';
import { CitationCard } from '../../shared/ui/CitationCard';
import { Badge } from '../../shared/ui/Badge';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { Skeleton } from '../../shared/ui/Skeleton';
import { Clock, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Детальная страница учебного материала.
 */
export const TopicDetailPage: React.FC = () => {
  const { learning } = useServices();
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<LearningTopic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTopic() {
      if (!slug) return;
      setIsLoading(true);
      const res = await learning.getTopicBySlug(slug);
      setTopic(res);
      setIsLoading(false);
    }
    fetchTopic();
  }, [learning, slug]);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold">Навчальну тему не знайдено</h2>
        <Link to="/learning" className="text-sky-600 hover:underline text-sm">
          Повернутися до каталогу навчання
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs
        items={[
          { label: 'Навчання', path: '/learning' },
          { label: topic.title },
        ]}
      />

      {/* Заголовок темы */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Badge status={topic.status} />
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Час вивчення: {topic.estimatedMinutes} хв.
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          {topic.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          {topic.summary}
        </p>
      </div>

      {/* Разделы учебного материала */}
      <div className="space-y-6">
        {topic.sections.map((sec) => (
          <div
            key={sec.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3"
          >
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              {sec.heading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {sec.bodyText}
            </p>

            {sec.citations && sec.citations.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Нормативні цитати за розділом:</span>
                {sec.citations.map((cit) => (
                  <CitationCard key={cit.id} citation={cit} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Практические кейсы для проверки */}
      {topic.practicalCases && topic.practicalCases.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Практична ситуація та алгоритм</span>
          </h2>

          {topic.practicalCases.map((c) => (
            <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs sm:text-sm">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{c.caseTitle}</h3>
              <p className="text-slate-600 dark:text-slate-300">{c.scenarioText}</p>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-900 dark:text-emerald-200 mt-2">
                <strong>Рекомендований алгоритм дій:</strong> {c.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
