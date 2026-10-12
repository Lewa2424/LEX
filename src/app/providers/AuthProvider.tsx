import React, { createContext, useContext, useMemo, useState } from 'react';
import type { UserRole } from '../../domain';
import { AppError } from '../../shared/errors/AppError';

export interface AuthSession {
  user: { id: string; name: string; email: string };
  role: UserRole;
  provider: 'mock' | 'supabase';
}

interface AuthContextValue {
  session: AuthSession | null;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const value = useMemo<AuthContextValue>(() => ({
    session,
    async signInWithGoogle() {
      if ((import.meta.env.VITE_DATA_MODE ?? 'mock') === 'supabase') {
        throw new AppError('NOT_CONFIGURED', 'Google OAuth для Supabase ще не налаштовано.');
      }
      setSession({
        user: { id: 'demo-user', name: 'Демонстраційний користувач', email: 'demo@example.invalid' },
        role: 'user',
        provider: 'mock',
      });
    },
    async signOut() {
      setSession(null);
    },
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth має використовуватися всередині AuthProvider.');
  return value;
};
