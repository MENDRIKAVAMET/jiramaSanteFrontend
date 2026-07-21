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

export type NotificationType = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
export type NotificationChannel = 'EMAIL' | 'SMS' | 'SYSTEM' | 'MOBILE';

export type PrescriptionStatus = 'PENDING' | 'FILLED' | 'CANCELLED' | 'EXPIRED';

export type CertificateType = 'MEDICAL' | 'FIT_TO_WORK' | 'SICK_LEAVE' | 'RETURN_TO_WORK';
