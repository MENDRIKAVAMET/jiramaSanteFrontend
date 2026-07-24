import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PUBLIC_ROUTES, getDefaultRouteForRole } from '../constants';
import { UserRole } from '../models';

export const authGuard: CanActivateFn = (_route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isPublicRoute = PUBLIC_ROUTES.includes(state.url);
  const isAuthenticated = auth.isAuthenticated() && !auth.isTokenExpired();

  if (isAuthenticated) {
    if (auth.mustChangePassword() && !state.url.startsWith('/change-password')) {
      return router.createUrlTree(['/change-password']);
    }
    return true;
  }
  if (isPublicRoute) return true;

  auth.clearSession();
  return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};

export const guestGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated() || auth.isTokenExpired()) {
    auth.clearSession();
    return true;
  }

  const role = auth.userRole();
  return router.createUrlTree([role ? getDefaultRouteForRole(role) : '/dashboard']);
};

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (_route, state): boolean | UrlTree => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated() || auth.isTokenExpired()) {
      auth.clearSession();
      return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
    }
    if (auth.hasRole(...allowedRoles)) return true;

    return router.createUrlTree(['/403']);
  };
};
