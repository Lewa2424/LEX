/**
 * @fileoverview Оркестратор маршрутів і провайдерів застосунку LEX.
 * Інтегрує ErrorBoundary, React.lazy, Suspense і централізований реєстр ROUTES.
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppShell } from '../shell/AppShell';
import { ThemeProvider } from '../providers/ThemeProvider';
import { QueryProvider } from '../providers/QueryProvider';
import { ServiceProvider } from '../providers/ServiceProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { ErrorBoundary } from '../../shared/ui/ErrorBoundary';
import { Skeleton } from '../../shared/ui/Skeleton';
import { ROUTES } from '../routes/routeRegistry';
import { AlertCircle } from 'lucide-react';

/**
 * Індикатор динамічного завантаження модуля (Suspense Fallback).
 */
const PageLoadingFallback: React.FC = () => (
  <div className="space-y-6 py-6 animate-pulse">
    <Skeleton className="h-10 w-64 rounded-xl" />
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
      <Skeleton className="h-6 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  </div>
);

/**
 * Заглушка 404 (Сторінку не знайдено).
 */
const NotFoundPage: React.FC = () => (
  <div className="py-16 text-center space-y-4">
    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
      <AlertCircle className="w-6 h-6" />
    </div>
    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">404 — Сторінку не знайдено</h1>
    <p className="text-xs text-slate-500 max-w-sm mx-auto">
      Запитаний розділ не існує або був переміщений.
    </p>
    <Link
      to="/"
      className="inline-block px-4 py-2.5 bg-sky-600 text-white text-xs font-semibold rounded-xl hover:bg-sky-700 transition-colors min-h-[44px]"
    >
      На головну сторінку
    </Link>
  </div>
);

/**
 * Головний оркестратор застосунку LEX.
 */
export const AppOrchestrator: React.FC = () => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ServiceProvider>
          <AuthProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<AppShell />}>
                    {ROUTES.map((route) => {
                      const Component = route.component;
                      if (route.path === '/') {
                        return (
                          <Route
                            key="index"
                            index
                            element={
                              <Suspense fallback={<PageLoadingFallback />}>
                                <Component />
                              </Suspense>
                            }
                          />
                        );
                      }
                      const subPath = route.path.replace(/^\//, '');
                      return (
                        <Route
                          key={subPath}
                          path={subPath}
                          element={
                            <Suspense fallback={<PageLoadingFallback />}>
                              <Component />
                            </Suspense>
                          }
                        />
                      );
                    })}

                    {/* Обробка неіснуючих маршрутів */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </AuthProvider>
        </ServiceProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
