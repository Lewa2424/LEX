export const PUBLICATION_STATUSES = [
  'draft',
  'under_review',
  'published',
  'needs_review',
  'archived',
  'rejected',
] as const;

export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

export const PUBLICATION_STATUS_LABELS: Record<PublicationStatus, string> = {
  draft: 'Чернетка',
  under_review: 'На перевірці',
  published: 'Опубліковано',
  needs_review: 'Потребує перевірки',
  archived: 'В архіві',
  rejected: 'Відхилено',
};
