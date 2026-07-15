import { UserRole } from '@core/models';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', path: '/dashboard', icon: 'dashboard', roles: ['ADMINISTRATEUR', 'MEDECIN', 'AGENT'] },
  { label: 'Déclarations', path: '/declarations', icon: 'assignment', roles: ['ADMINISTRATEUR', 'MEDECIN', 'AGENT'] },
  { label: 'Consultations', path: '/consultations', icon: 'medical_services', roles: ['ADMINISTRATEUR', 'MEDECIN', 'AGENT'] },
  { label: 'Diagnostics', path: '/diagnostics', icon: 'biotech', roles: ['ADMINISTRATEUR', 'MEDECIN'] },
  { label: 'Prescriptions', path: '/prescriptions', icon: 'receipt_long', roles: ['ADMINISTRATEUR', 'MEDECIN', 'AGENT'] },
  { label: 'Certificats', path: '/certificates', icon: 'verified', roles: ['ADMINISTRATEUR', 'MEDECIN', 'AGENT'] },
  { label: 'Agents', path: '/agents', icon: 'group', roles: ['ADMINISTRATEUR'] },
  { label: 'Médecins', path: '/doctors', icon: 'local_hospital', roles: ['ADMINISTRATEUR'] },
  { label: 'Directions', path: '/directions', icon: 'account_tree', roles: ['ADMINISTRATEUR'] },
  { label: 'Services', path: '/services', icon: 'domain', roles: ['ADMINISTRATEUR'] },
  { label: 'Postes', path: '/positions', icon: 'work', roles: ['ADMINISTRATEUR'] },
  { label: 'Symptômes', path: '/symptoms', icon: 'sick', roles: ['ADMINISTRATEUR'] },
  { label: 'Notifications', path: '/notifications', icon: 'notifications', roles: ['ADMINISTRATEUR', 'MEDECIN', 'AGENT'] },
  { label: 'Profil', path: '/profile', icon: 'person', roles: ['ADMINISTRATEUR', 'MEDECIN', 'AGENT'] },
  { label: 'Paramètres', path: '/settings', icon: 'settings', roles: ['ADMINISTRATEUR', 'MEDECIN', 'AGENT'] },
];
