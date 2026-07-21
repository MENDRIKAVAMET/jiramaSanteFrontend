import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  DashboardData, DashboardStats, DeclarationChartData,
  StatusDistributionData, MonthlyTrendData,
  RecentDeclaration, RecentConsultation,
  DashboardActivity, DashboardNotification,
} from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}`);
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/statistics`);
  }

  getDeclarationChart(): Observable<DeclarationChartData> {
    return this.http.get<DeclarationChartData>(`${this.baseUrl}/charts/declarations`);
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

  getAll(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.baseUrl);
  }

  getById(id: string): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<DashboardData>): Observable<DashboardData> {
    return this.http.post<DashboardData>(this.baseUrl, data);
  }

  update(id: string, data: Partial<DashboardData>): Observable<DashboardData> {
    return this.http.put<DashboardData>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(query: string, params?: { page: number; pageSize: number }): Observable<DashboardData> {
    const httpParams = new HttpParams()
      .set('query', query)
      .set('page', (params?.page ?? 1).toString())
      .set('pageSize', (params?.pageSize ?? 20).toString());

    return this.http.get<DashboardData>(`${this.baseUrl}/search`, { params: httpParams });
  }
}
