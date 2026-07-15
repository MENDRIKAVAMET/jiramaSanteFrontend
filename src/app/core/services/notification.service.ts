import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Notification, PaginatedResponse, PaginationParams } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<Notification>> {
    return this.http.get<PaginatedResponse<Notification>>(this.baseUrl, { params: toHttpParams(params) });
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.post<Notification>(`${this.baseUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/read-all`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
