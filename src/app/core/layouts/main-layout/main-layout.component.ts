import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter, switchMap, startWith, interval } from 'rxjs';

import { SessionService } from '@core/services/session.service';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { NotificationService } from '@core/services/notification.service';
import { FooterComponent, BreadcrumbComponent, BreadcrumbItem } from '@shared/components';
import { NAV_ITEMS, NavItem } from './nav-items';
import { UserRole, Notification, NotificationType } from '@core/models';

const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  declaration_creee: 'assignment',
  declaration_traitee: 'fact_check',
  consultation_programmee: 'medical_services',
  certificat_disponible: 'verified',
};

function timeAgo(dateIso: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateIso).getTime()) / 1000);
  if (seconds < 60) return "à l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

const ROLE_LABELS: Record<UserRole, string> = {
  ADMINISTRATEUR: 'Administrateur',
  MEDECIN: 'Médecin',
  AGENT: 'Agent',
};

interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    ReactiveFormsModule,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatButtonModule, MatIconModule, MatTooltipModule, MatBadgeModule,
    MatMenuModule, MatDividerModule, MatFormFieldModule, MatInputModule,
    FooterComponent, BreadcrumbComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  private readonly session = inject(SessionService);
  private readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly currentUser = this.auth.currentUser;
  readonly after: TooltipPosition = 'after';

  readonly isHandset = signal(false);
  readonly sidenavOpened = signal(true);
  readonly sidebarCollapsed = signal(false);
  readonly breadcrumbItems = signal<BreadcrumbItem[]>([]);
  readonly unreadNotifications = signal(0);
  readonly globalSearchControl = new FormControl('');

  readonly notifications = signal<NotificationItem[]>([]);

  readonly visibleNavItems = computed<NavItem[]>(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return NAV_ITEMS.filter((item) => item.roles.includes(user.role));
  });

  readonly roleLabel = computed<string>(() => {
    const user = this.auth.currentUser();
    return user ? (ROLE_LABELS[user.role] ?? user.role) : '';
  });

  readonly initials = computed<string>(() => {
    const user = this.auth.currentUser();
    if (!user) return '?';
    return ((user.firstName?.charAt(0) ?? '') + (user.lastName?.charAt(0) ?? '')).toUpperCase() || '?';
  });

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isHandset.set(result.matches);
      if (result.matches) this.sidenavOpened.set(false);
    });

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.buildBreadcrumb(event.urlAfterRedirects);
        if (this.isHandset()) this.sidenavOpened.set(false);
      });

    // Rafraîchit les notifications non lues toutes les 30s (uniquement in-app, aucun envoi d'email).
    interval(30000)
      .pipe(startWith(0), switchMap(() => this.notificationService.getUnread()))
      .subscribe({
        next: (notifications) => this.applyNotifications(notifications),
        error: () => { /* silencieux : la cloche ne doit pas casser le layout */ },
      });
  }

  toggleSidebar(): void {
    if (this.isHandset()) {
      this.sidenavOpened.update((v) => !v);
    } else {
      this.sidebarCollapsed.update((v) => !v);
    }
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  onGlobalSearch(): void {
    const query = this.globalSearchControl.value?.trim();
    if (!query) return;
    this.router.navigate(['/declarations'], { queryParams: { q: query } });
  }

  logout(): void {
    this.session.logout();
  }

  markNotificationRead(id: string): void {
    // Retire immédiatement l'élément de la liste des non-lues (mise à jour optimiste).
    this.notifications.update((items) => items.filter((n) => n.id !== id));
    this.unreadNotifications.update((count) => Math.max(0, count - 1));
    this.notificationService.markAsRead(id).subscribe({
      error: () => { /* on laisse le prochain polling corriger l'état si l'appel échoue */ },
    });
  }

  markAllNotificationsRead(): void {
    this.notifications.set([]);
    this.unreadNotifications.set(0);
    this.notificationService.markAllAsRead().subscribe({
      error: () => { /* on laisse le prochain polling corriger l'état si l'appel échoue */ },
    });
  }

  trackByNav(_index: number, item: NavItem): string { return item.path; }
  trackByNotification(_index: number, item: NotificationItem): string { return item.id; }

  private applyNotifications(notifications: Notification[]): void {
    const items: NotificationItem[] = notifications.map((n) => ({
      id: n.id,
      icon: NOTIFICATION_ICONS[n.type] ?? 'notifications',
      title: n.title,
      message: n.message,
      time: timeAgo(n.createdAt),
      unread: !n.isRead,
    }));
    this.notifications.set(items);
    this.unreadNotifications.set(items.length);
  }

  private buildBreadcrumb(url: string): void {
    const segments = url.split('/').filter(Boolean);
    const labelMap: Record<string, string> = {
      dashboard: 'Tableau de bord', agents: 'Agents', doctors: 'Médecins',
      declarations: 'Déclarations', consultations: 'Consultations', diagnostics: 'Diagnostics',
      prescriptions: 'Prescriptions', certificates: 'Certificats', directions: 'Directions',
      services: 'Services', positions: 'Postes', symptoms: 'Symptômes',
      notifications: 'Notifications', profile: 'Profil', settings: 'Paramètres',
    };
    const items: BreadcrumbItem[] = [{ label: 'Accueil', path: '/dashboard' }];
    let path = '';
    for (const segment of segments) {
      path += '/' + segment;
      items.push({ label: labelMap[segment] ?? segment, path });
    }
    this.breadcrumbItems.set(items);
  }
}