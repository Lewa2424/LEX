import { describe, expect, it } from 'vitest';
import { AppError, isAppError, toAppError } from '../shared/errors/AppError';
import { parseEnv } from '../shared/config/env';

describe('Stage 1 infrastructure', () => {
  it('preserves structured application errors', () => {
    const cause = new Error('network failure');
    const error = new AppError('DATA_UNAVAILABLE', 'Unable to load data', { cause });

    expect(isAppError(error)).toBe(true);
    expect(error.code).toBe('DATA_UNAVAILABLE');
    expect(error.cause).toBe(cause);
    expect(toAppError(error)).toBe(error);
  });

  it('validates environment requirements by data mode', () => {
    expect(parseEnv({ VITE_DATA_MODE: 'mock' }).VITE_DATA_MODE).toBe('mock');
    expect(() => parseEnv({ VITE_DATA_MODE: 'supabase' })).toThrow();
  });
});
