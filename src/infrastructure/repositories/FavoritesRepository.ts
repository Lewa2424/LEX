import type { FavoriteItem } from '../../shared/types';
import { favoritesService } from '../../mocks/services/FavoritesService';
import { AppError } from '../../shared/errors/AppError';

export interface FavoritesRepository {
  list(): Promise<FavoriteItem[]>;
  add(item: Omit<FavoriteItem, 'id' | 'addedAt'>): Promise<void>;
  remove(targetId: string): Promise<void>;
  syncForUser(userId: string): Promise<void>;
}

export class LocalFavoritesRepository implements FavoritesRepository {
  list(): Promise<FavoriteItem[]> {
    return favoritesService.getFavorites();
  }
  async add(item: Omit<FavoriteItem, 'id' | 'addedAt'>): Promise<void> {
    await favoritesService.addFavorite(item);
  }
  async remove(targetId: string): Promise<void> {
    await favoritesService.removeFavorite(targetId);
  }
  async syncForUser(): Promise<void> {
    throw new AppError('NOT_CONFIGURED', 'Синхронізацію обраного ще не підключено.');
  }
}

export class SupabaseFavoritesRepository implements FavoritesRepository {
  private notConfigured(): never {
    throw new AppError('NOT_CONFIGURED', 'Supabase FavoritesRepository ще не налаштовано.');
  }
  list(): Promise<FavoriteItem[]> { return this.notConfigured(); }
  add(): Promise<void> { return this.notConfigured(); }
  remove(): Promise<void> { return this.notConfigured(); }
  syncForUser(): Promise<void> { return this.notConfigured(); }
}
