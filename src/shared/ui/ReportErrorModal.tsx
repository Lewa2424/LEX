/**
 * @fileoverview Модальне вікно «Повідомити про помилку» для надсилання нотаток редакторам Salus.
 */

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useServices } from '../../app/providers/ServiceProvider';

export interface ReportErrorModalProps {
  /** Прапорець відкритості */
  isOpen: boolean;
  /** Обробник закриття */
  onClose: () => void;
  /** Контекст сторінки або джерела, на якому викликано вікно */
  pageContext?: string;
}

/**
 * Мокована форма повідомлення про помилку в нормативному матеріалі або інтерфейсі.
 */
export const ReportErrorModal: React.FC<ReportErrorModalProps> = ({ isOpen, onClose, pageContext = 'Загальний розділ' }) => {
  const { reports } = useServices();
  const [errorType, setErrorType] = useState('citation_error');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /** Обробник надсилання форми */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await reports.submit({
        problemType: errorType,
        materialContext: pageContext,
        comment: description,
        contactEmail: email || undefined,
      });
    } catch {
      setSubmitError('Не вдалося надіслати повідомлення. Дані не збережено.');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Повідомити про помилку або неточність">
      {isSubmitted ? (
        <div className="py-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Повідомлення успішно надіслано</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Дякуємо за допомогу! Редактори Salus перевірять інформацію та актуалізують матеріал.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{submitError}</p>}
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-sky-500 shrink-0" />
            <span>Контекст: <strong>{pageContext}</strong></span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Категорія зауваження
            </label>
            <select
              value={errorType}
              onChange={(e) => setErrorType(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="citation_error">Неточність у тексті цитати або НПА</option>
              <option value="outdated_law">Зміна нормативного акту (застаріло)</option>
              <option value="typo">Друкарська помилка або орфографічна помилка</option>
              <option value="ui_bug">Помилка в роботі інтерфейсу</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Опис помилки *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Вкажіть, у чому полягає помилка або який пункт НПА змінено..."
              className="w-full text-sm p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ваш E-mail для зворотного зв'язку (необов'язково)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Скасувати
            </Button>
            <Button variant="primary" type="submit">
              Надіслати редактору
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
