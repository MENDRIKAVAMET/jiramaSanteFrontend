import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Consultation, PaginatedResponse, PaginationParams } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/consultations`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<Consultation>> {
    return this.http.get<PaginatedResponse<Consultation>>(this.baseUrl, { params: toHttpParams(params) });
  }

  getById(id: string): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.baseUrl}/${id}`);
  }

  create(data: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>): Observable<Consultation> {
    return this.http.post<Consultation>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Consultation>): Observable<Consultation> {
    return this.http.patch<Consultation>(`${this.baseUrl}/${id}`, data);
  }

  getByDoctor(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.baseUrl}/my-consultations`);
  }

  getUpcoming(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.baseUrl}/upcoming`);
  }

  search(query: string, params?: Omit<PaginationParams, 'search'>): Observable<PaginatedResponse<Consultation>> {
    const requestParams: PaginationParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: query,
    };

    return this.http.get<PaginatedResponse<Consultation>>(this.baseUrl, {
      params: toHttpParams(requestParams),
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
