import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Service, PaginatedResponse, PaginationParams } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/services`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<Service>> {
    return this.http.get<PaginatedResponse<Service>>(this.baseUrl, { params: toHttpParams(params) });
  }

  getById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.baseUrl}/${id}`);
  }

  create(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Observable<Service> {
    return this.http.post<Service>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Service>): Observable<Service> {
    return this.http.put<Service>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(query: string, params?: Omit<PaginationParams, 'search'>): Observable<PaginatedResponse<Service>> {
    const requestParams: PaginationParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: query,
    };

    return this.http.get<PaginatedResponse<Service>>(this.baseUrl, {
      params: toHttpParams(requestParams),
    });
  }
}
