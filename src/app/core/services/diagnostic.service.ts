import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Diagnostic, PaginatedResponse, PaginationParams } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class DiagnosticService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/diagnostics`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<Diagnostic>> {
    return this.http.get<PaginatedResponse<Diagnostic>>(this.baseUrl, { params: toHttpParams(params) });
  }

  getById(id: string): Observable<Diagnostic> {
    return this.http.get<Diagnostic>(`${this.baseUrl}/${id}`);
  }

  create(data: Omit<Diagnostic, 'id' | 'createdAt' | 'updatedAt'>): Observable<Diagnostic> {
    return this.http.post<Diagnostic>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Diagnostic>): Observable<Diagnostic> {
    return this.http.patch<Diagnostic>(`${this.baseUrl}/${id}`, data);
  }

  search(query: string, params?: Omit<PaginationParams, 'search'>): Observable<PaginatedResponse<Diagnostic>> {
    const requestParams: PaginationParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: query,
    };

    return this.http.get<PaginatedResponse<Diagnostic>>(this.baseUrl, {
      params: toHttpParams(requestParams),
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
