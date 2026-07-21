import { Consultation } from './consultation.model';

export interface Diagnostic {
  id: string;
  consultationId: string;
  consultation?: Consultation;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/** Version aplatie utilisée par le tableau de la liste des diagnostics. */
export interface DiagnosticListItem {
  id: string;
  consultationRef: string;
  result: string;
  date: string;
}
