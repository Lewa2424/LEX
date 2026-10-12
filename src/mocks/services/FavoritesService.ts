/**
 * @fileoverview Локальный сервис Избранного с использованием localStorage.
 * Сохраняет выбранные пользователем материалы в браузере.
 */

import { FavoriteItem, MaterialType } from '../../shared/types';

const STORAGE_KEY = 'lex_user_favorites';

/** Интерфейс сервиса Избранного. */
export interface IFavoritesService {
  /** Возвращает все сохранённые элементы в Избранном */
  getFavorites(typeFilter?: MaterialType | 'all'): Promise<FavoriteItem[]>;
  /** Добавляет элемент в Избранное */
  addFavorite(item: Omit<FavoriteItem, 'id' | 'addedAt'>): Promise<FavoriteItem>;
  /** Удаляет элемент из Избранного по целевому ID */
  removeFavorite(targetId: string): Promise<boolean>;
  /** Проверяет, находится ли элемент в Избранном */
  isFavorite(targetId: string): Promise<boolean>;
  /** Очищает всё Избранное */
  clearFavorites(): Promise<void>;
}

/**
 * Реализация сервиса Избранного на базе локального хранилища браузера.
 */
export class MockFavoritesService implements IFavoritesService {
  /** Читает массив избранных элементов из localStorage. */
  private loadFromStorage(): FavoriteItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /** Сохраняет массив элементов в localStorage. */
  private saveToStorage(items: FavoriteItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Игнорируем ошибки при невозможности записи в localStorage
    }
  }

  /**
   * Возвращает список избранных материалов.
   * @param typeFilter Тип материала или 'all'
   */
  async getFavorites(typeFilter: MaterialType | 'all' = 'all'): Promise<FavoriteItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const items = this.loadFromStorage();
    if (typeFilter === 'all') {
      return items;
    }
    return items.filter((item) => item.type === typeFilter);
  }

  /**
   * Добавляет новую запись в Избранное.
   * @param item Объект добавляемого материала
   */
  async addFavorite(item: Omit<FavoriteItem, 'id' | 'addedAt'>): Promise<FavoriteItem> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const items = this.loadFromStorage();
    const existing = items.find((i) => i.targetId === item.targetId);
    if (existing) {
      return existing;
    }

    const newItem: FavoriteItem = {
      ...item,
      id: `fav-${Date.now()}`,
      addedAt: new Date().toLocaleDateString('ru-RU'),
    };

    items.unshift(newItem);
    this.saveToStorage(items);
    return newItem;
  }

  /**
   * Удаляет запись из Избранного по ID целевого материала.
   * @param targetId Уникальный идентификатор целевого материала
   */
  async removeFavorite(targetId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    let items = this.loadFromStorage();
    const initialLength = items.length;
    items = items.filter((i) => i.targetId !== targetId);
    this.saveToStorage(items);
    return items.length < initialLength;
  }

  /**
   * Проверяет, сохранён ли материал в Избранном.
   * @param targetId Целевой ID материала
   */
  async isFavorite(targetId: string): Promise<boolean> {
    const items = this.loadFromStorage();
    return items.some((i) => i.targetId === targetId);
  }

  /**
   * Полностью очищает список Избранного.
   */
  async clearFavorites(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    this.saveToStorage([]);
  }
}

/** Экземпляр сервиса Избранного. */
export const favoritesService = new MockFavoritesService();
