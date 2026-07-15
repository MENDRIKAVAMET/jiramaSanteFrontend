import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  DashboardData,
  DashboardStats,
  DeclarationChartData,
  ConsultationChartData,
  StatusDistributionData,
  MonthlyTrendData,
  RecentDeclaration,
  RecentConsultation,
  DashboardActivity,
  DashboardNotification,
} from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}`);
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }

  getDeclarationChart(): Observable<DeclarationChartData> {
    return this.http.get<DeclarationChartData>(`${this.baseUrl}/charts/declarations`);
  }

  getConsultationChart(): Observable<ConsultationChartData> {
    return this.http.get<ConsultationChartData>(`${this.baseUrl}/charts/consultations`);
  }

  getStatusDistribution(): Observable<StatusDistributionData> {
    return this.http.get<StatusDistributionData>(`${this.baseUrl}/charts/status-distribution`);
  }

  getMonthlyTrend(): Observable<MonthlyTrendData> {
    return this.http.get<MonthlyTrendData>(`${this.baseUrl}/charts/monthly-trend`);
  }

  getRecentDeclarations(): Observable<RecentDeclaration[]> {
    return this.http.get<RecentDeclaration[]>(`${this.baseUrl}/recent/declarations`);
  }

  getRecentConsultations(): Observable<RecentConsultation[]> {
    return this.http.get<RecentConsultation[]>(`${this.baseUrl}/recent/consultations`);
  }

  getActivities(): Observable<DashboardActivity[]> {
    return this.http.get<DashboardActivity[]>(`${this.baseUrl}/activities`);
  }

  getNotifications(): Observable<DashboardNotification[]> {
    return this.http.get<DashboardNotification[]>(`${this.baseUrl}/notifications`);
  }
}
