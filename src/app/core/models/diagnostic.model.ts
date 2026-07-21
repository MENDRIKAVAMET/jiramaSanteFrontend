export interface Diagnostic {
  id: string;
  consultationId: string;
  code: string;
  label: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  diagnosedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticListItem {
  id: string;
  reference: string;
  description: string;
  severity: string;
  date: string;
}
