/**
 * @fileoverview Нижній колонтитул (Footer) застосунку Salus.
 * Містить правовий дисклеймер, посилання на розділи та технічні відомості.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

/**
 * Колонтитул застосунку з попередженням про демонстраційний статус прототипу.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Колонка з інформацією про продукт */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-tight">Salus</span>
            </div>
            <p className="leading-relaxed opacity-80 text-[11px]">
              Практичний довідник з охорони праці: робочі ситуації, готові відповіді, бланки та терміни.
            </p>
          </div>

          {/* Навігаційні посилання */}
          <div>
            <h4 className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Розділи</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/reference" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">
                  Довідник ситуацій
                </Link>
              </li>
              <li>
                <Link to="/learning" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">
                  Навчальні теми
                </Link>
              </li>
              <li>
                <Link to="/first-aid" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">
                  Перша допомога
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Матеріали</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/forms" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">
                  Каталог бланків і документів
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">
                  Офіційні терміни та глосарій
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">
                  Збережене в Обраному
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>© {new Date().getFullYear()} Salus Охорона праці</div>
        </div>
      </div>
    </footer>
  );
};
