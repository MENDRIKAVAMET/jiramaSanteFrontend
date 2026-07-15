import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ThemeService } from './theme.service';
import { getDefaultRouteForRole, ROUTES_CONFIG } from '../constants';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly auth = inject(AuthService);
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  readonly sidebarCollapsed = signal<boolean>(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  navigateToDefault(): void {
    const role = this.auth.userRole();
    const target = role ? getDefaultRouteForRole(role) : '/dashboard';
    this.router.navigateByUrl(target);
  }

  navigateToLogin(): void {
    this.router.navigateByUrl(ROUTES_CONFIG.login);
  }

  logout(): void {
    const wasAuthenticated = this.auth.isAuthenticated();
    this.auth.logout().subscribe({
      next: () => {
        if (wasAuthenticated) this.navigateToLogin();
      },
      error: () => {
        if (wasAuthenticated) this.navigateToLogin();
      },
    });
  }
}
