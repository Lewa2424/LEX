import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const dataMode = import.meta.env.VITE_DATA_MODE ?? 'mock';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * У mock-режимі клієнт навмисно відсутній. Service role key ніколи не має
 * потрапляти до Vite-змінних або браузерного bundle.
 */
export const supabaseClient: SupabaseClient | null =
  dataMode === 'supabase' && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = (): boolean => supabaseClient !== null;
