import type { PublicationStatus } from './publicationStatus';

export interface SourceFragment {
  id: string;
  sourceVersionId: string;
  parentId?: string;
  fragmentType: 'title' | 'section' | 'article' | 'part' | 'paragraph' | 'appendix' | 'table' | 'note';
  ordinal: number;
  label?: string;
  textOriginal: string;
  normalizedText: string;
  anchor?: string;
  textHash?: string;
  isSearchable: boolean;
}

export interface LegalCitation {
  id: string;
  sourceFragmentId: string;
  quoteText: string;
  quoteStart?: number;
  quoteEnd?: number;
  editorialNote?: string;
  applicabilityNote?: string;
  status: PublicationStatus;
}
