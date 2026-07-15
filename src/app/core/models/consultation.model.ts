import { ConsultationType } from './enums.model';

export interface Consultation {
  id: string;
  declarationId: string;
  doctorId: string;
  doctorName: string;
  agentId: string;
  agentName: string;
  type: ConsultationType;
  consultationDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
