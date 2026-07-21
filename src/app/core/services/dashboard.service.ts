import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { DashboardData, DashboardStats } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.baseUrl);
  }

  getStatistics(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/statistics`);
  }
}
