import { PrescriptionStatus } from './enums.model';

export interface Prescription {
  id: string;
  consultationId: string;
  doctorId: string;
  doctorName: string;
  agentId: string;
  agentName: string;
  status: PrescriptionStatus;
  prescribedAt: string;
  validUntil: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
}
