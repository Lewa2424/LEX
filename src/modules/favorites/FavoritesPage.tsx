/**
 * @fileoverview Раздел сохранённых материалов (Избранное).
 * Работает через localStorage, позволяя быстро вернуться к сохраненным ситуациям, бланкам и терминам.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useServices } from '../../app/providers/ServiceProvider';
import { FavoriteItem } from '../../shared/types';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { Bookmark, Trash2, ArrowRight, BookOpen, FileText, FolderKanban } from 'lucide-react';

/**
 * Страница сохранённых материалов пользователя.
 */
export const FavoritesPage: React.FC = () => {
  const { favorites: favoritesService } = useServices();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'situation' | 'form' | 'term'>('all');

  // Загрузка сохранённых материалов
  useEffect(() => {
    async function load() {
      const items = await favoritesService.getFavorites();
      setFavorites(items);
    }
    load();
  }, [favoritesService]);

  /** Удалить элемент из Избранного */
  const handleRemove = async (id: string) => {
    await favoritesService.removeFavorite(id);
    setFavorites((prev) => prev.filter((item) => item.targetId !== id));
  };

  /** Очистить все Избранное */
  const handleClearAll = async () => {
    if (confirm('Ви впевнені, що хочете очистити весь список Обраного?')) {
      await favoritesService.clearFavorites();
      setFavorites([]);
    }
  };

  const filteredItems = favorites.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumbs items={[{ label: 'Обране' }]} />

      {/* Шапка */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
            <Bookmark className="w-5 h-5" />
            <span>Ваша збережена добірка</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Обрані матеріали ({favorites.length})
          </h1>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Очистити все</span>
          </button>
        )}
      </div>

      {/* Фильтры */}
      {favorites.length > 0 && (
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
              filterType === 'all'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Усі ({favorites.length})
          </button>
          <button
            onClick={() => setFilterType('situation')}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
              filterType === 'situation'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Ситуації ({favorites.filter((f) => f.type === 'situation').length})
          </button>
        </div>
      )}

      {/* Список сохраненных карточек */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 text-slate-500">
          <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base">
            В Обраному поки немає збережених матеріалів
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            Зберігайте робочі ситуації, бланки та статті, щоб мати миттєвий доступ до них під час роботи.
          </p>
          <Link
            to="/reference"
            className="inline-block mt-2 px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-lg hover:bg-sky-700 transition-colors"
          >
            Перейти до довідника
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const targetPath =
              item.type === 'situation'
                ? `/reference/${item.slug}`
                : item.type === 'form'
                ? `/forms/${item.slug}`
                : `/terms/${item.slug}`;

            return (
              <div
                key={item.targetId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="uppercase font-bold tracking-wider text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm">
                      {item.type}
                    </span>
                    <button
                      onClick={() => handleRemove(item.targetId)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title="Видалити з обраного"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link
                    to={targetPath}
                    className="font-bold text-base text-slate-900 dark:text-slate-100 hover:text-sky-600 transition-colors block"
                  >
                    {item.title}
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-2">{item.summary}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Link
                    to={targetPath}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Відкрити матеріал <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
