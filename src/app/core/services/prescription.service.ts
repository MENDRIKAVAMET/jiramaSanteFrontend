import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { PaginatedResponse, PaginationParams, Prescription, PrescriptionItem } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/prescriptions`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<Prescription>> {
    return this.http.get<PaginatedResponse<Prescription>>(this.baseUrl, { params: toHttpParams(params) });
  }

  getById(id: string): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.baseUrl}/${id}`);
  }

  getItems(id: string): Observable<PrescriptionItem[]> {
    return this.http.get<PrescriptionItem[]>(`${this.baseUrl}/${id}/items`);
  }

  create(data: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Observable<Prescription> {
    return this.http.post<Prescription>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Prescription>): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
