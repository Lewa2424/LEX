/**
 * @fileoverview Навігаційні хлібні крихти (Breadcrumbs).
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  /** Заголовок ланки */
  label: string;
  /** Посилання на маршрут (якщо не вказано — текстом) */
  path?: string;
}

export interface BreadcrumbsProps {
  /** Масив ланок навігації */
  items: BreadcrumbItem[];
}

/**
 * Елемент хлібних крихт для швидкого повернення за ієрархією розділів.
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Хлібні крихти" className="flex items-center text-xs text-slate-500 dark:text-slate-400 my-3">
      <Link
        to="/"
        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Головна</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
            {isLast || !item.path ? (
              <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
