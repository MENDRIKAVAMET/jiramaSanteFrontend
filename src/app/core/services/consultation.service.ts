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
    return this.http.put<Consultation>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
