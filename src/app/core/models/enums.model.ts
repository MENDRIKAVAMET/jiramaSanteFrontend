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
