/**
 * @fileoverview Заглушка завантаження (Skeleton) для карток і списків.
 */

import React from 'react';

export interface SkeletonProps {
  /** Висота в класах Tailwind (наприклад, "h-12") */
  className?: string;
}

/**
 * Анімований компонент плашки для стану завантаження.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-6 w-full' }) => {
  return (
    <div
      className={`bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
};
