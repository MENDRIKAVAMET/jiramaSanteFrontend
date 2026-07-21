import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Direction, PaginatedResponse, PaginationParams } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class DirectionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/directions`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<Direction>> {
    return this.http.get<PaginatedResponse<Direction>>(this.baseUrl, { params: toHttpParams(params) });
  }

  getById(id: string): Observable<Direction> {
    return this.http.get<Direction>(`${this.baseUrl}/${id}`);
  }

  create(data: Omit<Direction, 'id' | 'createdAt' | 'updatedAt'>): Observable<Direction> {
    return this.http.post<Direction>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Direction>): Observable<Direction> {
    return this.http.put<Direction>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(query: string, params?: Omit<PaginationParams, 'search'>): Observable<PaginatedResponse<Direction>> {
    const requestParams: PaginationParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: query,
    };

    return this.http.get<PaginatedResponse<Direction>>(this.baseUrl, {
      params: toHttpParams(requestParams),
    });
  }
}
