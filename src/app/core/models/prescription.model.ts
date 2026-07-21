import { Consultation } from './consultation.model';
import { PrescriptionStatus } from './enums.model';

export interface Prescription {
  id: string;
  consultationId: string;
  consultation?: Consultation;
  medication: string;
  dosage: string;
  duration: string;
  instructions: string | null;
  status: PrescriptionStatus;
  createdAt: string;
  updatedAt: string;
}

/** Version aplatie utilisée par le tableau de la liste des prescriptions. */
export interface PrescriptionListItem {
  id: string;
  reference: string;
  patientName: string;
  issuedAt: string;
  status: PrescriptionStatus;
}
