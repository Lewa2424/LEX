/**
 * @fileoverview Профиль пользователя и демонстрационная панель авторизации.
 */

import React, { useState } from 'react';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs';
import { LogIn, Shield, Building, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';

/**
 * Страница профиля и авторизации.
 */
export const ProfilePage: React.FC = () => {
  const { session, signInWithGoogle, signOut } = useAuth();
  const [authError, setAuthError] = useState('');
  const isLoggedIn = Boolean(session);
  const demoUser = {
    name: session?.user.name ?? '',
    email: session?.user.email ?? '',
    role: session?.role ?? 'guest',
    company: 'Демонстраційний локальний профіль',
  };

  const handleDemoGoogleLogin = async () => {
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch {
      setAuthError('Вхід не налаштовано для обраного режиму даних.');
    }
  };

  const handleLogout = () => {
    void signOut();
  };

  return (
    <div className="space-y-6 pb-8">
      <Breadcrumbs items={[{ label: 'Особистий кабінет' }]} />

      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        {!isLoggedIn ? (
          /* Экран входа */
          <div className="text-center space-y-4 py-6">
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Вхід до корпоративної системи Salus
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Авторизуйтеся через єдиний обліковий запис Google Workspace або ваш корпоративний email.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              {authError && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">{authError}</p>}
              <button
                onClick={handleDemoGoogleLogin}
                className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Увійти через Google Workspace</span>
              </button>
            </div>
          </div>
        ) : (
          /* Профиль авторизованного специалиста */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-lg">
                  {demoUser.name[0]}
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">{demoUser.name}</h2>
                  <p className="text-xs text-slate-400">{demoUser.email}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Активний
              </span>
            </div>

            {/* Карточки сведения */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-sky-500" /> Посада:
                </span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{demoUser.role}</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-indigo-500" /> Організація:
                </span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{demoUser.company}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleLogout}
                className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
              >
                Вийти з системи
              </button>
            </div>
          </div>
        )}
      </div>
      <section className="max-w-2xl mx-auto p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Конфіденційність</h2>
        <p>У mock-режимі вхід не звертається до Google і не створює реального облікового запису. Salus має збирати лише мінімальні дані профілю та обрані матеріали.</p>
        <p>Строки зберігання, процедура видалення та зовнішні обробники даних мають бути затверджені власником до production.</p>
      </section>
    </div>
  );
};
