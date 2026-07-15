export type UserRole = 'ADMINISTRATEUR' | 'MEDECIN' | 'AGENT';

export type DeclarationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export type ConsultationType =
  | 'INITIALE'
  | 'SUIVI'
  | 'URGENCE'
  | 'CONTROLE';

export type PrescriptionStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'DELIVERED'
  | 'CANCELLED';

export type CertificateType =
  | 'ARRET_MALADIE'
  | 'APTITUDE'
  | 'CONTRE_INDICATION'
  | 'EVACUATION';

export type NotificationType =
  | 'INFO'
  | 'WARNING'
  | 'ERROR'
  | 'SUCCESS';

export type NotificationChannel =
  | 'IN_APP'
  | 'EMAIL'
  | 'SMS';
