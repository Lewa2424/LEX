import React, { createContext, useContext, useMemo } from 'react';
import { services as mockServices, type ServiceRegistry } from '../../mocks/services';
import { env } from '../../shared/config/env';
import {
  LocalFavoritesRepository,
  MockContentRepository,
  MockReportsRepository,
  SupabaseContentRepository,
  SupabaseFavoritesRepository,
  SupabaseReportsRepository,
  type ContentRepository,
  type FavoritesRepository,
  type ReportsRepository,
} from '../../infrastructure/repositories';
import { lexicalSearchAdapter } from '../../infrastructure/search/LexicalSearchAdapter';

export interface ApplicationServices extends ServiceRegistry {
  content: ContentRepository;
  favoritesRepository: FavoritesRepository;
  reports: ReportsRepository;
}

const ServicesContext = createContext<ApplicationServices | null>(null);

export const ServiceProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const value = useMemo<ApplicationServices>(() => {
    const useSupabase = env.VITE_DATA_MODE === 'supabase';
    return {
      ...mockServices,
      search: lexicalSearchAdapter,
      content: useSupabase ? new SupabaseContentRepository() : new MockContentRepository(),
      favoritesRepository: useSupabase ? new SupabaseFavoritesRepository() : new LocalFavoritesRepository(),
      reports: useSupabase ? new SupabaseReportsRepository() : new MockReportsRepository(),
    };
  }, []);

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
};

export const useServices = (): ApplicationServices => {
  const value = useContext(ServicesContext);
  if (!value) throw new Error('useServices має використовуватися всередині ServiceProvider.');
  return value;
};
