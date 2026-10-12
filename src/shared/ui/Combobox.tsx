/**
 * @fileoverview Доступний компонент випадаючого списку з автодоповненням (Combobox).
 * Відповідає специфікаціям WAI-ARIA 1.2 Combobox Pattern.
 */

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

interface ComboboxProps {
  label: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Інтерактивний доступний елемент керування Combobox.
 */
export const Combobox: React.FC<ComboboxProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Оберіть варіант...',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const labelId = useId();
  const comboboxId = useId();
  const listboxId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Фільтрація варіантів за введеним текстом
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (opt.description && opt.description.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  // Закриття при кліку зовні
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFilterQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Вибір елемента
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFilterQuery('');
    setFocusedIndex(-1);
  };

  // Навігація з клавіатури
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFilterQuery('');
        setFocusedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setFilterQuery('');
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative space-y-1.5 ${className}`}>
      {/* Мітка елемента */}
      <label id={labelId} htmlFor={comboboxId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      {/* Поле тригера списку */}
      <div className="relative">
        <button
          id={comboboxId}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={labelId}
          aria-controls={listboxId}
          role="combobox"
          className={`w-full min-h-[44px] px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left text-xs font-medium text-slate-900 dark:text-slate-100 flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span className={selectedOption ? 'truncate' : 'text-slate-400 dark:text-slate-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Випадаюче меню з опціями */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden max-h-60 flex flex-col">
          {/* Поле пошуку всередині списку */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setFocusedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Фільтр..."
              className="w-full text-xs bg-transparent focus:outline-none text-slate-900 dark:text-slate-100"
              autoFocus
            />
          </div>

          {/* Список варіантів */}
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            className="overflow-y-auto py-1 divide-y divide-slate-50 dark:divide-slate-800/50"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-xs text-slate-400 text-center">Варіантів не знайдено</li>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.value === value;
                const isFocused = index === focusedIndex;

                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`min-h-[44px] px-4 py-2.5 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isFocused ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200' : 'text-slate-800 dark:text-slate-200'
                    } ${isSelected ? 'font-bold' : ''}`}
                  >
                    <div className="flex flex-col">
                      <span>{opt.label}</span>
                      {opt.description && (
                        <span className="text-[10px] text-slate-400 font-normal">{opt.description}</span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
