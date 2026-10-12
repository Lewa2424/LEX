/**
 * @fileoverview Глобальний компонент обробки непередбачених помилок React (ErrorBoundary).
 * Перехоплює помилки рендерингу та виводить безпечний екран відновлення.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Класовий компонент запобіжника помилок застосунку.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Неперехоплена помилка застосунку:', error, errorInfo);
  }

  private handleReset = (): void => {
    // Повне перезавантаження надійніше за soft-reset після фатальної помилки рендеру
    // (інакше можна залишитися зі зламаним контекстом / HMR-станом).
    window.location.reload();
  };

  private handleGoHome = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-lg text-center space-y-6">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/50 rounded-2xl flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Стався збій компонента
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Під час обробки екрана виникла непередбачена помилка. Ви можете оновити поточну сторінку або повернутися на головну.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl text-left font-mono text-xs text-rose-700 dark:text-rose-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition-colors min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Спробувати знову</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors min-h-[44px]"
              >
                <Home className="w-4 h-4" />
                <span>На головну</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
