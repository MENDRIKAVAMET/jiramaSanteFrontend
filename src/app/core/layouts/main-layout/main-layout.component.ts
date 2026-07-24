import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
import { Subject, catchError, debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';

import { SessionService } from '@core/services/session.service';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { SearchService } from '@core/services/search.service';
import { FooterComponent, BreadcrumbComponent, BreadcrumbItem } from '@shared/components';
import { NAV_ITEMS, NavItem } from './nav-items';
import { UserRole, SearchResultItem } from '@core/models';

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
    RouterOutlet, RouterLink, RouterLinkActive, FormsModule,
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
  private readonly searchService = inject(SearchService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  readonly currentUser = this.auth.currentUser;
  readonly after: TooltipPosition = 'after';

  readonly isHandset = signal(false);
  readonly sidenavOpened = signal(true);
  readonly sidebarCollapsed = signal(false);
  readonly breadcrumbItems = signal<BreadcrumbItem[]>([]);
  readonly unreadNotifications = signal(3);

  readonly searchQuery = signal('');
  readonly searchResults = signal<SearchResultItem[]>([]);
  readonly searchLoading = signal(false);
  readonly searchPanelOpen = signal(false);
  private readonly searchTerms = new Subject<string>();

  readonly notifications = signal<NotificationItem[]>([
    { id: '1', icon: 'assignment', title: 'Nouvelle déclaration', message: 'Une déclaration a été soumise', time: 'il y a 5 min', unread: true },
    { id: '2', icon: 'medical_services', title: 'Consultation programmée', message: 'Consultation le 16/07 à 10h', time: 'il y a 1 h', unread: true },
    { id: '3', icon: 'verified', title: 'Certificat émis', message: "Certificat d'aptitude disponible", time: 'il y a 3 h', unread: true },
  ]);

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
        this.searchPanelOpen.set(false);
      });

    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term.trim().length < 2) {
            this.searchLoading.set(false);
            return of(null);
          }
          this.searchLoading.set(true);
          return this.searchService.search(term).pipe(catchError(() => of(null)));
        }),
      )
      .subscribe((results) => {
        this.searchLoading.set(false);
        this.searchResults.set(results ? this.searchService.toResultItems(results) : []);
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

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.searchPanelOpen.set(true);
    this.searchTerms.next(value);
  }

  onSearchFocus(): void {
    if (this.searchQuery().trim().length >= 2) {
      this.searchPanelOpen.set(true);
    }
  }

  goToSearchResult(item: SearchResultItem): void {
    this.searchPanelOpen.set(false);
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.router.navigate(item.routerLink);
  }

  trackBySearchResult(_index: number, item: SearchResultItem): string {
    return `${item.category}-${item.id}`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.search-wrapper')) {
      this.searchPanelOpen.set(false);
    }
  }

  logout(): void {
    this.session.logout();
  }

  markNotificationRead(id: string): void {
    this.notifications.update((items) => items.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    this.updateUnreadCount();
  }

  markAllNotificationsRead(): void {
    this.notifications.update((items) => items.map((n) => ({ ...n, unread: false })));
    this.updateUnreadCount();
  }

  trackByNav(_index: number, item: NavItem): string { return item.path; }
  trackByNotification(_index: number, item: NotificationItem): string { return item.id; }

  private updateUnreadCount(): void {
    this.unreadNotifications.set(this.notifications().filter((n) => n.unread).length);
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
