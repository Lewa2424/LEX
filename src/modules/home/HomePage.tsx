/**
 * @fileoverview Головна сторінка Salus: пошук і мінімалістична навігація по модулях.
 */

import React, { useState, useEffect, useRef, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useServices } from '../../app/providers/ServiceProvider';
import { ReferenceSituation, SearchSuggestion } from '../../shared/types';
import { Badge } from '../../shared/ui/Badge';
import {
  Search,
  BookOpen,
  GraduationCap,
  HeartPulse,
  FileText,
  FolderKanban,
  ChevronRight,
  Clock,
} from 'lucide-react';

/** Модулі швидкої навігації (порядок фіксований). */
const QUICK_CATEGORIES = [
  {
    title: 'Довідник',
    desc: '17 сфер охорони праці: у кожній — підрозділи, конкретні ситуації та готові відповіді без зайвих шаблонів.',
    icon: BookOpen,
    path: '/reference',
    iconClass: 'text-sky-600 dark:text-sky-400',
    hoverClass: 'hover:border-sky-300 dark:hover:border-sky-700',
  },
  {
    title: 'Перша допомога',
    desc: 'Окремий модуль з алгоритмами домедичної допомоги при травмах і кровотечах — не список ситуацій довідника.',
    icon: HeartPulse,
    path: '/first-aid',
    iconClass: 'text-rose-600 dark:text-rose-400',
    hoverClass: 'hover:border-rose-300 dark:hover:border-rose-700',
  },
  {
    title: 'Бланки документів',
    desc: 'Каталог форм: журнали, акти, наряди-допуски, картки обліку. Можна відкрити бланк окремо від робочої ситуації.',
    icon: FileText,
    path: '/forms',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    hoverClass: 'hover:border-emerald-300 dark:hover:border-emerald-700',
  },
  {
    title: 'Глосарій термінів',
    desc: 'Словник термінів з охорони праці з короткими й зрозумілими визначеннями.',
    icon: FolderKanban,
    path: '/terms',
    iconClass: 'text-amber-600 dark:text-amber-400',
    hoverClass: 'hover:border-amber-300 dark:hover:border-amber-700',
  },
  {
    title: 'Навчання',
    desc: 'Навчальні курси та програми. Це окремий контур; операційні відповіді шукайте в довіднику ситуацій.',
    icon: GraduationCap,
    path: '/learning',
    iconClass: 'text-indigo-600 dark:text-indigo-400',
    hoverClass: 'hover:border-indigo-300 dark:hover:border-indigo-700',
  },
] as const;

/**
 * Головна сторінка-вітрина Salus.
 */
export const HomePage: React.FC = () => {
  const { search, reference } = useServices();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [updatedSituations, setUpdatedSituations] = useState<ReferenceSituation[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchReqIdRef = useRef<number>(0);

  const comboboxId = useId();
  const listboxId = useId();

  useEffect(() => {
    reference.getUpdatedSituations(4).then(setUpdatedSituations);
  }, [reference]);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length >= 2) {
      const currentReqId = ++searchReqIdRef.current;
      search.getSuggestions(trimmed).then((res) => {
        if (currentReqId === searchReqIdRef.current) {
          setSuggestions(res);
          setShowSuggestions(true);
          setActiveIndex(-1);
        }
      });
    } else {
      searchReqIdRef.current++;
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  }, [search, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && searchQuery.trim().length >= 2) {
        setShowSuggestions(true);
        setActiveIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setActiveIndex(-1);
        break;
    }
  };

  const handleSelectSuggestion = (sug: SearchSuggestion) => {
    setShowSuggestions(false);
    setActiveIndex(-1);
    if (sug.type === 'situation') navigate(`/reference/${sug.slug}`);
    else if (sug.type === 'learning') navigate(`/learning/${sug.slug}`);
    else if (sug.type === 'form') navigate(`/forms/${sug.slug}`);
    else if (sug.type === 'term') navigate(`/terms/${sug.slug}`);
    else navigate(`/search?q=${encodeURIComponent(sug.title)}`);
  };

  return (
    <div className="space-y-8 pb-8">
      <section className="bg-slate-50 dark:bg-slate-900/80 px-6 pt-4 pb-6 sm:px-10 sm:pt-5 sm:pb-8 rounded-lg border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-2">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            Пошуково-довідкова платформа Salus
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Практичні відповіді на робочі питання з охорони праці — від допуску працівника до дій після аварії.
          </p>
        </div>

        <div ref={searchContainerRef} className="relative max-w-2xl mx-auto text-left">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              id={comboboxId}
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-controls={listboxId}
              aria-activedescendant={
                activeIndex >= 0 && suggestions[activeIndex]
                  ? `home-sug-opt-${suggestions[activeIndex].id}`
                  : undefined
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введіть робочий запит (наприклад: первинний інструктаж, висотні роботи, ЗІЗ, розслідування нещасних випадків)..."
              className="w-full text-sm sm:text-base pl-12 pr-28 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 rounded text-slate-900 dark:text-slate-100 shadow-xs focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded transition-colors cursor-pointer"
            >
              Знайти
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div
              id={listboxId}
              role="listbox"
              aria-label="Підказки пошуку"
              className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded shadow-2xl border border-slate-200 dark:border-slate-800 py-2 overflow-hidden z-50 animate-fadeIn"
            >
              <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Знайдені елементи
              </div>
              {suggestions.map((sug, index) => {
                const isSelected = index === activeIndex;
                return (
                  <button
                    key={sug.id}
                    id={`home-sug-opt-${sug.id}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectSuggestion(sug)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <span className="truncate">{sug.title}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0 ml-2">
                      {sug.contextSnippet}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Розділи
        </div>
        <div className="flex flex-col gap-2">
          {QUICK_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.path}
                to={cat.path}
                className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-4 py-3.5 sm:px-5 sm:py-4 flex items-center gap-4 transition-all ${cat.hoverClass} hover:shadow-xs group`}
              >
                <div className="p-2.5 rounded bg-slate-100 dark:bg-slate-800 shrink-0">
                  <Icon className={`w-5 h-5 ${cat.iconClass}`} />
                </div>
                <div className="min-w-0 flex-1 text-left space-y-0.5">
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      </section>

      {updatedSituations.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm uppercase tracking-tight">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3>Останні оновлені відповіді</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ситуації, які нещодавно були доповнені або уточнені.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {updatedSituations.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-3.5 rounded border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <Link
                    to={`/reference/${item.slug}`}
                    className="font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block"
                  >
                    {item.title}
                  </Link>
                  <div className="text-slate-500 text-[10px] font-mono">
                    Оновлено: {item.lastCheckDate}
                  </div>
                </div>
                <Badge status="updated" size="sm" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
