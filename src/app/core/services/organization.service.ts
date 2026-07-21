import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Direction, PaginatedResponse, PaginationParams, Position, Service } from '../models';
import { toHttpParams } from './http-utils';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/organization`;

  // Directions
  getDirections(params: PaginationParams): Observable<PaginatedResponse<Direction>> {
    return this.http.get<PaginatedResponse<Direction>>(`${this.baseUrl}/directions`, { params: toHttpParams(params) });
  }

  getDirectionById(id: string): Observable<Direction> {
    return this.http.get<Direction>(`${this.baseUrl}/directions/${id}`);
  }

  createDirection(data: Omit<Direction, 'id' | 'createdAt' | 'updatedAt'>): Observable<Direction> {
    return this.http.post<Direction>(`${this.baseUrl}/directions`, data);
  }

  updateDirection(id: string, data: Partial<Direction>): Observable<Direction> {
    return this.http.patch<Direction>(`${this.baseUrl}/directions/${id}`, data);
  }

  deleteDirection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/directions/${id}`);
  }

  // Services
  getServices(params: PaginationParams): Observable<PaginatedResponse<Service>> {
    return this.http.get<PaginatedResponse<Service>>(`${this.baseUrl}/services`, { params: toHttpParams(params) });
  }

  getServiceById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.baseUrl}/services/${id}`);
  }

  createService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Observable<Service> {
    return this.http.post<Service>(`${this.baseUrl}/services`, data);
  }

  updateService(id: string, data: Partial<Service>): Observable<Service> {
    return this.http.patch<Service>(`${this.baseUrl}/services/${id}`, data);
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/services/${id}`);
  }

  // Positions
  getPositions(params: PaginationParams): Observable<PaginatedResponse<Position>> {
    return this.http.get<PaginatedResponse<Position>>(`${this.baseUrl}/positions`, { params: toHttpParams(params) });
  }

  getPositionById(id: string): Observable<Position> {
    return this.http.get<Position>(`${this.baseUrl}/positions/${id}`);
  }

  createPosition(data: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>): Observable<Position> {
    return this.http.post<Position>(`${this.baseUrl}/positions`, data);
  }

  updatePosition(id: string, data: Partial<Position>): Observable<Position> {
    return this.http.patch<Position>(`${this.baseUrl}/positions/${id}`, data);
  }

  deletePosition(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/positions/${id}`);
  }
}
