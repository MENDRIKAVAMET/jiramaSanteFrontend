import { CertificateType } from './enums.model';

export interface Certificate {
  id: string;
  consultationId: string;
  type: CertificateType;
  agentId: string;
  agentName: string;
  doctorId: string;
  doctorName: string;
  startDate: string;
  endDate: string | null;
  issuedAt: string;
  documentUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateListItem {
  id: string;
  reference: string;
  type: CertificateType;
  issuedTo: string;
  date: string;
}
