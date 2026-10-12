import type { PublicationStatus } from './publicationStatus';

export interface Term {
  id: string;
  slug: string;
  name: string;
  officialDefinition?: string;
  editorialExplanation?: string;
  synonyms: string[];
  status: PublicationStatus;
}
