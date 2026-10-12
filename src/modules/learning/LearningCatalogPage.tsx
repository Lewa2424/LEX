/**
 * @fileoverview Каталог учебных программ и тем по охране труда.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useServices } from '../../app/providers/ServiceProvider';
import { LearningDirection, LearningTopic } from '../../shared/types';
import { Badge } from '../../shared/ui/Badge';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { Skeleton } from '../../shared/ui/Skeleton';
import { GraduationCap, Clock, BookOpen, ArrowRight } from 'lucide-react';

/**
 * Главная страница раздела Обучение.
 */
export const LearningCatalogPage: React.FC = () => {
  const { learning } = useServices();
  const [directions, setDirections] = useState<LearningDirection[]>([]);
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [selectedDirectionId, setSelectedDirectionId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка направлений и тем
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [dirsList, topicsList] = await Promise.all([
        learning.getDirections(),
        learning.getTopics(selectedDirectionId),
      ]);
      setDirections(dirsList);
      setTopics(topicsList);
      setIsLoading(false);
    }
    fetchData();
  }, [learning, selectedDirectionId]);

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumbs items={[{ label: 'Навчання з охорони праці' }]} />

      {/* Шапка раздела */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
          <GraduationCap className="w-5 h-5" />
          <span>Навчальні програми Salus</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Скорочені навчальні матеріали з охорони праці
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Зосереджені матеріали за програмами А, Б і В, підготовка до перевірки знань і практичні розбори робочих ситуацій.
        </p>
      </div>

      {/* Фильтр по программам */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
        <button
          onClick={() => setSelectedDirectionId('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            selectedDirectionId === 'all'
              ? 'bg-sky-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Усі програми навчання
        </button>
        {directions.map((dir) => (
          <button
            key={dir.id}
            onClick={() => setSelectedDirectionId(dir.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedDirectionId === dir.id
                ? 'bg-sky-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {dir.title}
          </button>
        ))}
      </div>

      {/* Сетка учебных тем */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/learning/${topic.slug}`}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-sky-300 dark:hover:border-sky-700 transition-all shadow-xs hover:shadow-md group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-sky-500" /> ~{topic.estimatedMinutes} хв.
                  </span>
                  <Badge status={topic.status} size="sm" />
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-sky-600 dark:text-sky-400 font-semibold">
                <span>Вивчити матеріал</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
