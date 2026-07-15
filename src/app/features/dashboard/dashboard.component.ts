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
  private readonly auth = inject(AuthService);
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

  readonly statusLabels: Record<string, string> = {
    DRAFT: 'Brouillon', SUBMITTED: 'Soumise', IN_REVIEW: 'En revue',
    APPROVED: 'Approuvée', REJECTED: 'Rejetée',
  };

  readonly statusColors: Record<string, string> = {
    DRAFT: '#b0bec5', SUBMITTED: '#00897b', IN_REVIEW: '#1e88e5',
    APPROVED: '#4caf50', REJECTED: '#f44336',
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);
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
      error: () => { this.loading.set(false); },
    });
  }

  getStatusLabel(status: string): string { return this.statusLabels[status] ?? status; }
  getStatusColor(status: string): string { return this.statusColors[status] ?? '#b0bec5'; }

  refresh(): void { this.loadDashboardData(); }
}
