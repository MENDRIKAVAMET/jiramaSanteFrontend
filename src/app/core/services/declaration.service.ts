import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Declaration, DeclarationListItem, PaginatedResponse, PaginationParams } from '../models';
import { toHttpParams } from './http-utils';

/**
 * Le backend renvoie l'entité `Declaration` brute (avec `number` et une
 * relation `agent` imbriquée), pas la forme aplatie `DeclarationListItem`.
 * Cette fonction convertit une déclaration brute vers la forme utilisée
 * par les tableaux et les listes déroulantes de sélection.
 */
export function mapDeclarationToListItem(declaration: any): DeclarationListItem {
  return {
    id: declaration.id,
    reference: declaration.reference ?? declaration.number ?? '—',
    agentName: declaration.agentName
      ?? (declaration.agent ? `${declaration.agent.firstName} ${declaration.agent.lastName}` : '—'),
    status: declaration.status,
    declarationDate: declaration.declarationDate ?? declaration.date,
  };
}

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

  search(query: string, params?: Omit<PaginationParams, 'search'>): Observable<PaginatedResponse<DeclarationListItem>> {
    const requestParams: PaginationParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      search: query,
    };

    return this.http.get<PaginatedResponse<DeclarationListItem>>(this.baseUrl, {
      params: toHttpParams(requestParams),
    });
  }

  create(data: Omit<Declaration, 'id' | 'reference' | 'createdAt' | 'updatedAt'>): Observable<Declaration> {
    return this.http.post<Declaration>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Declaration>): Observable<Declaration> {
    return this.http.patch<Declaration>(`${this.baseUrl}/${id}`, data);
  }

  getPending(): Observable<DeclarationListItem[]> {
    return this.http.get<DeclarationListItem[]>(`${this.baseUrl}/pending`);
  }

  getMyDeclarations(): Observable<DeclarationListItem[]> {
    return this.http.get<DeclarationListItem[]>(`${this.baseUrl}/my-declarations`);
  }

  assignDoctor(id: string, doctorId: string): Observable<Declaration> {
    return this.http.patch<Declaration>(`${this.baseUrl}/${id}/assign`, { doctorId });
  }

  updateStatus(id: string, status: string): Observable<Declaration> {
    return this.http.patch<Declaration>(`${this.baseUrl}/${id}/status`, { status });
  }
}
