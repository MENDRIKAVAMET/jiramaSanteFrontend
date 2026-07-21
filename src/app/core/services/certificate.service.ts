import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Certificate, PaginatedResponse, PaginationParams } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/certificates`;

  getAll(params: PaginationParams): Observable<PaginatedResponse<Certificate>> {
    return this.http.get<PaginatedResponse<Certificate>>(this.baseUrl, { params: toHttpParams(params) });
  }

  getById(id: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.baseUrl}/${id}`);
  }

  create(data: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>): Observable<Certificate> {
    return this.http.post<Certificate>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Certificate>): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.baseUrl}/${id}`, data);
  }

  search(query: string, params?: Omit<PaginationParams, 'search'>): Observable<PaginatedResponse<Certificate>> {
    const requestParams: PaginationParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: query,
    };

    return this.http.get<PaginatedResponse<Certificate>>(this.baseUrl, {
      params: toHttpParams(requestParams),
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
