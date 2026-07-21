import { SymptomSeverity } from './enums.model';

export interface Symptom {
  id: string;
  code: string | null;
  name: string;
  category: string | null;
  description: string | null;
  severity: SymptomSeverity;
  createdAt: string;
  updatedAt: string;
}
