import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { getDefaultRouteForRole, ROUTES_CONFIG } from '../constants';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  toggleSidebar(): void {
    const sidebar = document.querySelector<HTMLElement>('[data-sidebar-toggle]');
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
  }

  navigateToDefault(): void {
    const role = this.auth.userRole();
    this.router.navigateByUrl(role ? getDefaultRouteForRole(role) : '/dashboard');
  }

  navigateToLogin(): void {
    this.router.navigateByUrl(ROUTES_CONFIG.login);
  }

  logout(): void {
    const wasAuthenticated = this.auth.isAuthenticated();
    this.auth.logout();
    if (wasAuthenticated) this.navigateToLogin();
  }
}
