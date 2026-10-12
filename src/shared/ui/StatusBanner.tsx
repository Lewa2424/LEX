/**
 * @fileoverview Банер попередження та правового дисклеймера LEX.
 * Гарантує чітку візуальну маркування демонстраційних нормативних цитат.
 */

import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export interface StatusBannerProps {
  /** Тип банера */
  type?: 'warning' | 'info' | 'success';
  /** Заголовок повідомлення */
  title?: string;
  /** Основний текст або дочірні елементи */
  children?: React.ReactNode;
  /** Посилання або дія */
  action?: React.ReactNode;
  /** Приховати іконку */
  noIcon?: boolean;
}

/**
 * Плашка попередження або демонстраційного сповіщення.
 */
export const StatusBanner: React.FC<StatusBannerProps> = ({
  type = 'warning',
  title = 'Демонстраційні дані',
  children = 'Справжній нормативний вміст підключається на наступному етапі. Тексти є демонстраційними зразками і не використовуються як чинні нормативні вимоги.',
  action,
  noIcon = false,
}) => {
  const styles = {
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80',
      text: 'text-amber-900 dark:text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
    },
    info: {
      bg: 'bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800/80',
      text: 'text-sky-900 dark:text-sky-200',
      icon: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />,
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80',
      text: 'text-emerald-900 dark:text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
    },
  };

  const current = styles[type];

  return (
    <div className={`p-3.5 rounded-lg border ${current.bg} ${current.text} text-sm flex items-start gap-3 my-2`}>
      {!noIcon && current.icon}
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
