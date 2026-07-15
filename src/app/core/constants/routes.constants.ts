import { UserRole } from '../models/enums.model';

export const ROUTES_CONFIG = {
  login: '/login',
  dashboard: '/dashboard',
  forbidden: '/403',
  notFound: '/404',
} as const;

export const PUBLIC_ROUTES: string[] = ['/login', '/403', '/404'];

export const ROLE_DEFAULT_ROUTE: Record<UserRole, string> = {
  ADMINISTRATEUR: '/dashboard',
  MEDECIN: '/dashboard',
  AGENT: '/dashboard',
};

export function getDefaultRouteForRole(role: UserRole): string {
  return ROLE_DEFAULT_ROUTE[role] ?? ROUTES_CONFIG.dashboard;
}
