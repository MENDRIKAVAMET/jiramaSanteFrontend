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

  getById(id: string): Observable<Notification> {
    return this.http.get<Notification>(`${this.baseUrl}/${id}`);
  }

  search(query: string, params?: Omit<PaginationParams, 'search'>): Observable<PaginatedResponse<Notification>> {
    const requestParams: PaginationParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: query,
    };

    return this.http.get<PaginatedResponse<Notification>>(this.baseUrl, {
      params: toHttpParams(requestParams),
    });
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.patch<Notification>(`${this.baseUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/mark-all-read`, {});
  }

  getUnread(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/unread`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
