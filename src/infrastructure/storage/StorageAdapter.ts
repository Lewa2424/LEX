import { AppError } from '../../shared/errors/AppError';

export interface StoredFileMetadata {
  path: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  contentHash?: string;
  version: string;
}

export interface StorageAdapter {
  upload(file: File, path: string): Promise<StoredFileMetadata>;
  createDownloadUrl(path: string): Promise<string>;
}

export class SupabaseStorageAdapter implements StorageAdapter {
  private notConfigured(): never {
    throw new AppError('NOT_CONFIGURED', 'Supabase Storage ще не налаштовано.');
  }
  upload(): Promise<StoredFileMetadata> { return this.notConfigured(); }
  createDownloadUrl(): Promise<string> { return this.notConfigured(); }
}
