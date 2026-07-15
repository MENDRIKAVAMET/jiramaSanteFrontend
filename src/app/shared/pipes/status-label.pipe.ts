import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel',
  standalone: true,
})
export class StatusLabelPipe implements PipeTransform {
  private readonly labels: Record<string, string> = {
    DRAFT: 'Brouillon',
    SUBMITTED: 'Soumise',
    IN_REVIEW: 'En revue',
    APPROVED: 'Approuvée',
    REJECTED: 'Rejetée',
    ACTIVE: 'Actif',
    EXPIRED: 'Expiré',
    DELIVERED: 'Délivré',
    CANCELLED: 'Annulé',
    LOW: 'Faible',
    MEDIUM: 'Moyen',
    HIGH: 'Élevé',
    CRITICAL: 'Critique',
    INITIALE: 'Initiale',
    SUIVI: 'Suivi',
    URGENCE: 'Urgence',
    CONTROLE: 'Contrôle',
    ARRET_MALADIE: 'Arrêt maladie',
    APTITUDE: 'Aptitude',
    CONTRE_INDICATION: 'Contre-indication',
    EVACUATION: 'Évacuation',
  };

  transform(value: string | null | undefined): string {
    if (!value) return '—';
    return this.labels[value] ?? value;
  }
}
