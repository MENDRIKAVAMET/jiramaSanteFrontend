import { Declaration } from './declaration.model';
import { Doctor } from './doctor.model';
import { CertificateType } from './enums.model';

export interface Certificate {
  id: string;
  declarationId: string;
  declaration?: Declaration;
  doctorId?: string | null;
  doctor?: Doctor | null;
  type: CertificateType;
  content: string;
  issuedAt: string;
  validFrom: string;
  validTo: string;
  createdAt: string;
  updatedAt: string;
}

/** Version aplatie utilisée par le tableau de la liste des certificats. */
export interface CertificateListItem {
  id: string;
  reference: string;
  type: CertificateType;
  issuedTo: string;
  date: string;
}
