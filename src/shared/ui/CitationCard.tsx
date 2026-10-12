/**
 * @fileoverview Картка відображення нормативної цитати з реквізитами джерела.
 * Ключовий доказовий компонент системи LEX.
 */

import React from 'react';
import { Citation } from '../types';
import { Button } from './Button';
import { ExternalLink, BookOpen, Quote } from 'lucide-react';
import { stripCitationServicePrefix } from '../lib/citationDisplay';

export interface CitationCardProps {
  /** Дані перевіреної цитати */
  citation: Citation;
  /** Обробник відкриття модального вікна з контекстом навколо цитати */
  onOpenContext?: (citation: Citation) => void;
  /** Компактний режим для вкладених списків */
  compact?: boolean;
}

/**
 * Картка точної цитати з НПА з указанням джерела та статусу перевірки.
 */
export const CitationCard: React.FC<CitationCardProps> = ({ citation, onOpenContext, compact = false }) => {
  const displayText = stripCitationServicePrefix(citation.text);

  if (compact) {
    return (
      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed my-2">{displayText}</p>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs my-3">
      <div className="relative p-3 border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-r-md">
        <Quote className="absolute right-3 top-3 w-5 h-5 text-indigo-400 opacity-20" />
        <p className="text-slate-900 dark:text-slate-100 text-sm leading-relaxed">{displayText}</p>
      </div>

      {(onOpenContext || citation.source.officialUrl) && (
        <div className="mt-3 flex flex-wrap items-center justify-end gap-2 text-xs">
          {onOpenContext && (
            <Button
              variant="outline"
              size="sm"
              icon={<BookOpen className="w-3.5 h-3.5" />}
              onClick={() => onOpenContext(citation)}
            >
              Контекст
            </Button>
          )}
          {citation.source.officialUrl && (
            <a
              href={citation.source.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium hover:underline px-2 py-1"
            >
              Офіційне джерело <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
