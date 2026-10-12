import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { canOpenAdmin, type UserRole } from '../../domain';

const adminLinks = [
  ['/admin/sources', 'Джерела'],
  ['/admin/citations', 'Цитати'],
  ['/admin/terms', 'Терміни'],
  ['/admin/situations', 'Ситуації'],
  ['/admin/forms', 'Форми'],
  ['/admin/learning', 'Навчання'],
  ['/admin/first-aid', 'Домедична допомога'],
] as const;

export const getLocalRole = (): UserRole => {
  const value = localStorage.getItem('lex_role') as UserRole | null;
  return value ?? 'guest';
};

export const AdminLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const role = getLocalRole();
  if (!canOpenAdmin(role)) {
    return (
      <section className="my-8 rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <h1 className="text-xl font-bold">Редакційний розділ недоступний</h1>
        <p className="mt-2 text-sm">Локальна роль не має доступу. Для демонстрації встановіть `localStorage.lex_role` як `editor`, `reviewer`, `medical_reviewer` або `admin`.</p>
        <p className="mt-2 text-xs">Це лише візуальний gate. У production доступ обов’язково має перевірятися RLS та server-side політиками.</p>
        <Link to="/" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-indigo-700 dark:text-indigo-300">Повернутися на головну</Link>
      </section>
    );
  }

  return (
    <div className="space-y-5 py-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Локальний редакційний контур</p>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Адміністрування Salus</h1>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">Роль: {role}</span>
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Адміністративні розділи">
          {adminLinks.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      {children ?? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold">Редакційна панель</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Оберіть розділ. Дані зберігаються лише в пам’яті поточної вкладки та не є опублікованими.</p>
        </section>
      )}
    </div>
  );
};
