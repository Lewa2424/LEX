/**
 * @fileoverview Верхній заголовок і глобальна навігація застосунку Salus.
 * Пошук — окремий пункт меню `/search` (без дублюючого поля в шапці).
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../providers/ThemeProvider';
import { Drawer } from '../../shared/ui/Drawer';
import {
  Shield,
  Search,
  BookOpen,
  GraduationCap,
  HeartPulse,
  FileText,
  Bookmark,
  Sun,
  Moon,
  User,
  Menu,
  AlertCircle,
  FolderKanban,
} from 'lucide-react';

export interface HeaderProps {
  /** Обробник відкриття вікна повідомлення про помилку */
  onOpenReportError?: () => void;
}

/**
 * Головний навігаційний заголовок Salus.
 */
export const Header: React.FC<HeaderProps> = ({ onOpenReportError }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Довідник', path: '/reference', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Пошук', path: '/search', icon: <Search className="w-4 h-4" /> },
    { label: 'Навчання', path: '/learning', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Перша допомога', path: '/first-aid', icon: <HeartPulse className="w-4 h-4" /> },
    { label: 'Бланки', path: '/forms', icon: <FileText className="w-4 h-4" /> },
    { label: 'Терміни', path: '/terms', icon: <FolderKanban className="w-4 h-4" /> },
    { label: 'Обране', path: '/favorites', icon: <Bookmark className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group min-h-[44px]">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                Salus
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Охорона праці
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Перемкнути тему оформлення"
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {onOpenReportError && (
              <button
                type="button"
                onClick={onOpenReportError}
                title="Повідомити про помилку редактору"
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer min-h-[44px]"
              >
                <AlertCircle className="w-4 h-4 text-indigo-500" />
                <span>Помилка?</span>
              </button>
            )}

            <Link
              to="/profile"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors min-h-[44px]"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Увійти</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Відкрити мобільне меню навігації"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Навігація Salus"
        position="left"
      >
        <div className="space-y-4">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {onOpenReportError && (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenReportError();
              }}
              className="w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px]"
            >
              <AlertCircle className="w-4 h-4 text-indigo-500" />
              <span>Повідомити про помилку</span>
            </button>
          )}
        </div>
      </Drawer>
    </header>
  );
};
