import { Declaration } from './declaration.model';
import { Doctor } from './doctor.model';
import { ConsultationStatus } from './enums.model';

export interface Consultation {
  id: string;
  declarationId: string;
  declaration?: Declaration;
  doctorId?: string | null;
  doctor?: Doctor | null;
  scheduledAt: string;
  status: ConsultationStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Version aplatie utilisée par le tableau de la liste des consultations. */
export interface ConsultationListItem {
  id: string;
  reference: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: ConsultationStatus;
}
