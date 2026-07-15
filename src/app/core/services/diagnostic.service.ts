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
    return this.http.put<Diagnostic>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
