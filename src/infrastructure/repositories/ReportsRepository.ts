import { AppError } from '../../shared/errors/AppError';

export interface ContentReport {
  id: string;
  problemType: string;
  materialContext: string;
  comment: string;
  contactEmail?: string;
  createdAt: string;
}

export interface ReportsRepository {
  submit(report: Omit<ContentReport, 'id' | 'createdAt'>): Promise<ContentReport>;
  list(): Promise<ContentReport[]>;
}

const reports: ContentReport[] = [];

export class MockReportsRepository implements ReportsRepository {
  async submit(report: Omit<ContentReport, 'id' | 'createdAt'>): Promise<ContentReport> {
    const saved = { ...report, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    reports.push(saved);
    return saved;
  }
  async list(): Promise<ContentReport[]> {
    return reports.map((report) => ({ ...report }));
  }
}

export class SupabaseReportsRepository implements ReportsRepository {
  private notConfigured(): never {
    throw new AppError('NOT_CONFIGURED', 'Supabase ReportsRepository ще не налаштовано.');
  }
  submit(): Promise<ContentReport> { return this.notConfigured(); }
  list(): Promise<ContentReport[]> { return this.notConfigured(); }
}
