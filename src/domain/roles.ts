export const USER_ROLES = [
  'guest',
  'user',
  'editor',
  'reviewer',
  'medical_reviewer',
  'admin',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const EDITORIAL_ROLES: UserRole[] = ['editor', 'reviewer', 'medical_reviewer', 'admin'];

export const canOpenAdmin = (role: UserRole): boolean => EDITORIAL_ROLES.includes(role);
