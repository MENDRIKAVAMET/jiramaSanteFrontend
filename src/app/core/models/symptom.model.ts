export interface Symptom {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string | null;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
