import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Agent, PaginatedResponse, PaginationParams } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/agents`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<Agent>> {
    return this.http.get<PaginatedResponse<Agent>>(this.baseUrl, { params: toHttpParams(params) });
  }

  getById(id: string): Observable<Agent> {
    return this.http.get<Agent>(`${this.baseUrl}/${id}`);
  }

  create(data: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Observable<Agent> {
    return this.http.post<Agent>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Agent>): Observable<Agent> {
    return this.http.patch<Agent>(`${this.baseUrl}/${id}`, data);
  }

  search(query: string, params?: Omit<PaginationParams, 'search'>): Observable<PaginatedResponse<Agent>> {
    const requestParams: PaginationParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: query,
    };

    return this.http.get<PaginatedResponse<Agent>>(this.baseUrl, {
      params: toHttpParams(requestParams),
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
