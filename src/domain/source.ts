import type { PublicationStatus } from './publicationStatus';

export type LegalSourceKind = 'law' | 'resolution' | 'order' | 'register' | 'guidance' | 'standard' | 'other';
export type LegalSourceCurrentStatus = 'active' | 'future' | 'repealed' | 'unknown';

export interface LegalSource {
  id: string;
  jurisdiction: 'UA';
  sourceKind: LegalSourceKind;
  title: string;
  number?: string;
  issuer?: string;
  adoptionDate?: string;
  officialUrl?: string;
  officialDomain?: string;
  externalIdentifier?: string;
  currentStatus: LegalSourceCurrentStatus;
  publicationStatus: PublicationStatus;
}

export interface LegalSourceVersion {
  id: string;
  sourceId: string;
  versionLabel: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  sourceUrl?: string;
  contentHash?: string;
  reviewStatus: PublicationStatus;
}
