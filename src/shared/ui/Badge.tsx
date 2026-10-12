/**
 * @fileoverview Бейдж статусу актуальності та перевірки для матеріалів LEX.
 */

import React from 'react';
import { VerificationStatus } from '../types';
import { CheckCircle2, RefreshCw, Archive, Clock, HelpCircle } from 'lucide-react';

export interface BadgeProps {
  /** Статус перевірки документа */
  status: VerificationStatus | string;
  /** Кастомний підпис замість дефолтної назви статусу */
  label?: string;
  /** Розмір бейджа */
  size?: 'sm' | 'md';
  /** Використовувати лише текст без іконки */
  noIcon?: boolean;
}

/**
 * Візуальний компонент статусу документа або цитати.
 * Відображає статус текстом і іконкою для підвищення доступності.
 */
export const Badge: React.FC<BadgeProps> = ({ status, label, size = 'md', noIcon = false }) => {
  const statusConfigs: Record<string, { bg: string; text: string; icon: React.ReactNode; defaultLabel: string }> = {
    verified: {
      bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      defaultLabel: 'перевірено',
    },
    updated: {
      bg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      text: 'text-indigo-800 dark:text-indigo-300 font-bold uppercase tracking-wider',
      icon: <RefreshCw className="w-3.5 h-3.5" />,
      defaultLabel: 'оновлено',
    },
    archived: {
      bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider',
      icon: <Archive className="w-3.5 h-3.5" />,
      defaultLabel: 'архівовано',
    },
    under_review: {
      bg: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      text: 'text-sky-800 dark:text-sky-300 font-bold uppercase tracking-wider',
      icon: <Clock className="w-3.5 h-3.5" />,
      defaultLabel: 'на перевірці',
    },
    draft: {
      bg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
      text: 'text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider',
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      defaultLabel: 'чернетка',
    },
  };

  const config = statusConfigs[status] || statusConfigs.draft;
  const displayText = label || config.defaultLabel;

  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5 gap-1' : 'text-[10px] px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${sizeClasses}`}
    >
      {!noIcon && <span className="shrink-0">{config.icon}</span>}
      <span className="whitespace-nowrap">{displayText}</span>
    </span>
  );
};
