/**
 * @fileoverview Оболонка застосунку (AppShell).
 * Об'єднує заголовок, основну область контенту, колонтитул і глобальні діалогові вікна.
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ReportErrorModal } from '../../shared/ui/ReportErrorModal';

/**
 * Головна компонувальна оболонка застосунку.
 */
export const AppShell: React.FC = () => {
  const [isReportErrorOpen, setIsReportErrorOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Верхній заголовок */}
      <Header onOpenReportError={() => setIsReportErrorOpen(true)} />

      {/* Основна контентна область */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Колонтитул сайту */}
      <Footer />

      {/* Глобальне модальне вікно з повідомленням про помилку */}
      <ReportErrorModal
        isOpen={isReportErrorOpen}
        onClose={() => setIsReportErrorOpen(false)}
        pageContext={window.location.pathname}
      />
    </div>
  );
};
