import type { PublicationStatus } from '../../domain';
import { MOCK_SOURCES } from '../../mocks/data/sourcesData';
import { MOCK_TERMS } from '../../mocks/data/termsData';
import { AppError } from '../../shared/errors/AppError';

export type AdminContentKind = 'source' | 'term' | 'citation' | 'situation' | 'form' | 'learning' | 'first_aid';

export interface AdminContentRecord {
  id: string;
  kind: AdminContentKind;
  title: string;
  summary: string;
  status: PublicationStatus;
  metadata?: Record<string, string>;
}

export interface ContentRepository {
  list(kind: AdminContentKind): Promise<AdminContentRecord[]>;
  save(record: AdminContentRecord): Promise<AdminContentRecord>;
  remove(kind: AdminContentKind, id: string): Promise<void>;
  transition(kind: AdminContentKind, id: string, status: PublicationStatus): Promise<AdminContentRecord>;
}

const records: AdminContentRecord[] = [
  ...MOCK_SOURCES.slice(0, 3).map((source) => ({
    id: source.id,
    kind: 'source' as const,
    title: source.title,
    summary: `Демонстраційне джерело: ${source.publisher}`,
    status: 'draft' as const,
  })),
  ...MOCK_TERMS.slice(0, 3).map((term) => ({
    id: term.id,
    kind: 'term' as const,
    title: term.term,
    summary: 'Демонстраційний термін без підтвердження офіційним джерелом.',
    status: 'draft' as const,
  })),
  {
    id: 'demo-citation-1',
    kind: 'citation',
    title: 'Демонстраційна цитата',
    summary: 'Текст-плейсхолдер. Не є перевіреною правовою цитатою.',
    status: 'draft',
  },
];

export class MockContentRepository implements ContentRepository {
  async list(kind: AdminContentKind): Promise<AdminContentRecord[]> {
    return records.filter((record) => record.kind === kind).map((record) => ({ ...record }));
  }

  async save(record: AdminContentRecord): Promise<AdminContentRecord> {
    const index = records.findIndex((item) => item.kind === record.kind && item.id === record.id);
    const saved = { ...record };
    if (index >= 0) records[index] = saved;
    else records.push(saved);
    return { ...saved };
  }

  async remove(kind: AdminContentKind, id: string): Promise<void> {
    const index = records.findIndex((record) => record.kind === kind && record.id === id);
    if (index >= 0) records.splice(index, 1);
  }

  async transition(kind: AdminContentKind, id: string, status: PublicationStatus): Promise<AdminContentRecord> {
    const record = records.find((item) => item.kind === kind && item.id === id);
    if (!record) throw new AppError('NOT_FOUND', 'Матеріал не знайдено.');
    record.status = status;
    return { ...record };
  }
}

export class SupabaseContentRepository implements ContentRepository {
  private notConfigured(): never {
    throw new AppError('NOT_CONFIGURED', 'Supabase repository ще не налаштовано.');
  }
  list(): Promise<AdminContentRecord[]> { return this.notConfigured(); }
  save(): Promise<AdminContentRecord> { return this.notConfigured(); }
  remove(): Promise<void> { return this.notConfigured(); }
  transition(): Promise<AdminContentRecord> { return this.notConfigured(); }
}
