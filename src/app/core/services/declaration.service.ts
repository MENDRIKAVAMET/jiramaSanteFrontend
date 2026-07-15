import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Declaration, DeclarationListItem, PaginatedResponse, PaginationParams } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class DeclarationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/declarations`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<DeclarationListItem>> {
    return this.http.get<PaginatedResponse<DeclarationListItem>>(this.baseUrl, { params: toHttpParams(params) });
  }

  getById(id: string): Observable<Declaration> {
    return this.http.get<Declaration>(`${this.baseUrl}/${id}`);
  }

  create(data: Omit<Declaration, 'id' | 'reference' | 'createdAt' | 'updatedAt'>): Observable<Declaration> {
    return this.http.post<Declaration>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Declaration>): Observable<Declaration> {
    return this.http.put<Declaration>(`${this.baseUrl}/${id}`, data);
  }

  submit(id: string): Observable<Declaration> {
    return this.http.post<Declaration>(`${this.baseUrl}/${id}/submit`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
