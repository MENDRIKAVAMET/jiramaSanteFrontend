import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { PaginatedResponse, PaginationParams, Symptom } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class SymptomService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/symptoms`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<Symptom>> {
    return this.http.get<PaginatedResponse<Symptom>>(this.baseUrl, { params: toHttpParams(params) });
  }

  getById(id: string): Observable<Symptom> {
    return this.http.get<Symptom>(`${this.baseUrl}/${id}`);
  }

  create(data: Omit<Symptom, 'id' | 'createdAt' | 'updatedAt'>): Observable<Symptom> {
    return this.http.post<Symptom>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Symptom>): Observable<Symptom> {
    return this.http.patch<Symptom>(`${this.baseUrl}/${id}`, data);
  }

  search(query: string, params?: Omit<PaginationParams, 'search'>): Observable<PaginatedResponse<Symptom>> {
    const requestParams: PaginationParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: query,
    };

    return this.http.get<PaginatedResponse<Symptom>>(this.baseUrl, {
      params: toHttpParams(requestParams),
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
