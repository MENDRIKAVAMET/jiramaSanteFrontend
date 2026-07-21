export type UserRole = 'ADMINISTRATEUR' | 'MEDECIN' | 'AGENT';

export type DeclarationType =
  | 'maladie'
  | 'accident'
  | 'blessure'
  | 'symptome'
  | 'visite_medicale';

export type DeclarationPriority = 'faible' | 'moyenne' | 'elevee' | 'urgente';

export type DeclarationStatus =
  | 'nouveau'
  | 'en_cours'
  | 'traite'
  | 'clos'
  | 'annule';

export type ConsultationStatus = 'planifiee' | 'terminee' | 'annulee';

export type PrescriptionStatus = 'active' | 'terminee' | 'annulee';

export type CertificateType = 'repos' | 'arret_travail' | 'aptitude' | 'inaptitude';

export type SymptomSeverity = 'faible' | 'moyenne' | 'elevee';

export type NotificationType =
  | 'declaration_creee'
  | 'declaration_traitee'
  | 'consultation_programmee'
  | 'certificat_disponible';

export type NotificationChannel = 'application' | 'email' | 'sms';

export const DECLARATION_STATUS_LABELS: Record<DeclarationStatus, string> = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  traite: 'Traité',
  clos: 'Clos',
  annule: 'Annulé',
};

export const DECLARATION_PRIORITY_LABELS: Record<DeclarationPriority, string> = {
  faible: 'Faible',
  moyenne: 'Moyenne',
  elevee: 'Élevée',
  urgente: 'Urgente',
};

export const CONSULTATION_STATUS_LABELS: Record<ConsultationStatus, string> = {
  planifiee: 'Planifiée',
  terminee: 'Terminée',
  annulee: 'Annulée',
};

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
  active: 'Active',
  terminee: 'Terminée',
  annulee: 'Annulée',
};

export const CERTIFICATE_TYPE_LABELS: Record<CertificateType, string> = {
  repos: 'Repos',
  arret_travail: 'Arrêt de travail',
  aptitude: 'Aptitude',
  inaptitude: 'Inaptitude',
};

export const SYMPTOM_SEVERITY_LABELS: Record<SymptomSeverity, string> = {
  faible: 'Faible',
  moyenne: 'Moyenne',
  elevee: 'Élevée',
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  declaration_creee: 'Nouvelle déclaration',
  declaration_traitee: 'Déclaration traitée',
  consultation_programmee: 'Consultation programmée',
  certificat_disponible: 'Certificat disponible',
};
