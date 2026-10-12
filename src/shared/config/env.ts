import { z } from 'zod';

const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().url().optional(),
);

const optionalString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(1).optional(),
);

export const envSchema = z
  .object({
    VITE_APP_URL: z.string().url().default('http://localhost:3000'),
    VITE_DATA_MODE: z.enum(['mock', 'supabase']).default('mock'),
    VITE_SUPABASE_URL: optionalUrl,
    VITE_SUPABASE_ANON_KEY: optionalString,
  })
  .superRefine((value, context) => {
    if (value.VITE_DATA_MODE !== 'supabase') return;

    if (!value.VITE_SUPABASE_URL) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['VITE_SUPABASE_URL'],
        message: 'VITE_SUPABASE_URL is required in supabase mode',
      });
    }

    if (!value.VITE_SUPABASE_ANON_KEY) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['VITE_SUPABASE_ANON_KEY'],
        message: 'VITE_SUPABASE_ANON_KEY is required in supabase mode',
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

export const parseEnv = (input: unknown): Env => envSchema.parse(input);

export const env = parseEnv(import.meta.env);
