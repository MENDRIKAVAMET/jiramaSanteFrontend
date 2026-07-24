import { Agent } from './agent.model';
import { Certificate } from './certificate.model';
import { Declaration } from './declaration.model';
import { Doctor } from './doctor.model';

export interface GlobalSearchResults {
  agents: Agent[];
  doctors: Doctor[];
  declarations: Declaration[];
  certificates: Certificate[];
}

export type SearchResultCategory = 'agent' | 'doctor' | 'declaration' | 'certificate';

/** Ligne normalisée affichée dans le panneau de résultats de la recherche globale. */
export interface SearchResultItem {
  category: SearchResultCategory;
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  routerLink: string[];
}
