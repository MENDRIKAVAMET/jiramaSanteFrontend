import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';

import {
  PageHeaderComponent, StatCardComponent, EmptyStateComponent,
  LineChartComponent, DoughnutChartComponent, BarChartComponent,
} from '@shared/components';
import { AuthService } from '@core/services/auth.service';
import { DashboardService } from '@core/services/dashboard.service';
import { NAV_ITEMS } from '@core/layouts/main-layout/nav-items';
import {
  DashboardStats, DeclarationChartData, StatusDistributionData,
  MonthlyTrendData, RecentDeclaration, RecentConsultation,
  DashboardActivity, DashboardNotification,
} from '@core/models';

interface QuickAction {
  label: string;
  icon: string;
  path: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink, DatePipe,
    MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule,
    MatProgressBarModule, MatTableModule, MatChipsModule,
    PageHeaderComponent, StatCardComponent, EmptyStateComponent,
    LineChartComponent, DoughnutChartComponent, BarChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  readonly firstName = signal(this.auth.currentUser()?.firstName ?? '');
  readonly loading = signal(true);

  readonly stats = signal<DashboardStats | null>(null);
  readonly declarationChart = signal<DeclarationChartData | null>(null);
  readonly statusDistribution = signal<StatusDistributionData | null>(null);
  readonly monthlyTrend = signal<MonthlyTrendData | null>(null);
  readonly recentDeclarations = signal<RecentDeclaration[]>([]);
  readonly recentConsultations = signal<RecentConsultation[]>([]);
  readonly activities = signal<DashboardActivity[]>([]);
  readonly notifications = signal<DashboardNotification[]>([]);
  readonly loadError = signal(false);

  readonly unreadNotifications = computed(() => this.notifications().filter((n) => !n.isRead).length);

  readonly quickActions: QuickAction[] = [
    { label: 'Déclaration', icon: 'assignment', path: '/declarations', color: 'primary' },
    { label: 'Consultation', icon: 'medical_services', path: '/consultations', color: 'accent' },
    { label: 'Prescription', icon: 'receipt_long', path: '/prescriptions', color: 'success' },
    { label: 'Certificat', icon: 'verified', path: '/certificates', color: 'warn' },
    { label: 'Notifications', icon: 'notifications', path: '/notifications', color: 'primary' },
    { label: 'Profil', icon: 'person', path: '/profile', color: 'accent' },
  ];

  readonly declarationColumns = ['reference', 'agentName', 'status', 'declarationDate'];
  readonly consultationColumns = ['patientName', 'doctorName', 'type', 'date', 'status'];

  readonly quickActionsForRole = computed<QuickAction[]>(() => {
    const role = this.auth.userRole();
    if (!role) return [];
    return this.quickActions.filter((action) => {
      const navItem = NAV_ITEMS.find((item) => item.path === action.path);
      return navItem ? navItem.roles.includes(role) : true;
    });
  });

  readonly statusLabels: Record<string, string> = {
    nouveau: 'Nouveau', en_cours: 'En cours', traite: 'Traité',
    clos: 'Clos', annule: 'Annulé',
  };

  /* Palette alignée sur la charte JIRAMA Santé */
  readonly statusColors: Record<string, string> = {
    nouveau: '#00796b',   // Vert principal
    en_cours: '#e65100',  // Orange JIRAMA
    traite: '#10b981',    // Vert succès
    clos: '#6b7280',      // Muted / Neutre
    annule: '#ef4444',    // Rouge erreur
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.stats.set(data.stats);
        this.declarationChart.set(data.declarationChart);
        this.statusDistribution.set(data.statusDistribution);
        this.monthlyTrend.set(data.monthlyTrend);
        this.recentDeclarations.set(data.recentDeclarations);
        this.recentConsultations.set(data.recentConsultations);
        this.activities.set(data.activities);
        this.notifications.set(data.notifications);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  getStatusLabel(status: string): string { return this.statusLabels[status] ?? status; }
  getStatusColor(status: string): string { return this.statusColors[status] ?? '#9ca3af'; }

  refresh(): void { this.loadDashboardData(); }
}