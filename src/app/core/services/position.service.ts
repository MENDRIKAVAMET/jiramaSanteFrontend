import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Position, PaginatedResponse, PaginationParams } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class PositionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/positions`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<Position>> {
    return this.http.get<PaginatedResponse<Position>>(this.baseUrl, { params: toHttpParams(params) });
  }

  getById(id: string): Observable<Position> {
    return this.http.get<Position>(`${this.baseUrl}/${id}`);
  }

  create(data: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>): Observable<Position> {
    return this.http.post<Position>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Position>): Observable<Position> {
    return this.http.patch<Position>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(query: string, params?: Omit<PaginationParams, 'search'>): Observable<PaginatedResponse<Position>> {
    const requestParams: PaginationParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: query,
    };

    return this.http.get<PaginatedResponse<Position>>(this.baseUrl, {
      params: toHttpParams(requestParams),
    });
  }
}
