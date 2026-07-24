import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CreateDoctorPayload, Doctor, DoctorCreationResult, PaginatedResponse, PaginationParams } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/doctors`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<Doctor>> {
    return this.http.get<PaginatedResponse<Doctor>>(this.baseUrl, { params: toHttpParams(params) });
  }

  getById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateDoctorPayload): Observable<DoctorCreationResult> {
    return this.http.post<DoctorCreationResult>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Doctor>): Observable<Doctor> {
    return this.http.patch<Doctor>(`${this.baseUrl}/${id}`, data);
  }

  search(query: string, params?: Omit<PaginationParams, 'search'>): Observable<PaginatedResponse<Doctor>> {
    const requestParams: PaginationParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: query,
    };

    return this.http.get<PaginatedResponse<Doctor>>(this.baseUrl, {
      params: toHttpParams(requestParams),
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
