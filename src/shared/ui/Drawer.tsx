/**
 * @fileoverview Доступне висувне меню (Drawer) для мобільної навігації.
 * Реалізує Focus Trap, початкову установку фокуса, повернення фокуса та обробку Escape.
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
}

/**
 * Доступна висувна панель (Drawer).
 * Рендериться в document.body через portal: інакше fixed ламається всередині
 * header з backdrop-filter / sticky (containing block).
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title = 'Меню навігації',
  children,
  position = 'left',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Керування фокусом і захоплення фокуса (Focus Trap)
  useEffect(() => {
    if (!isOpen) return;

    // Зберігаємо елемент, що мав фокус до відкриття панелі
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;

    // Початкова установка фокуса
    const focusTimer = setTimeout(() => {
      if (drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          drawerRef.current.focus();
        }
      }
    }, 30);

    // Захоплення фокуса (Focus Trap) і обробка Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';

      // Повернення фокуса елементу, що відкрив панель
      if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const positionClasses = position === 'left' ? 'left-0' : 'right-0 ml-auto';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex" role="dialog" aria-modal="true" aria-label={title}>
      {/* Затемнений фон кліку зовні */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Панель Drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`relative z-10 w-80 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col focus:outline-none ${positionClasses}`}
      >
        {/* Шапка панелі */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between min-h-[56px] shrink-0">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити меню"
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Вміст Drawer */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
