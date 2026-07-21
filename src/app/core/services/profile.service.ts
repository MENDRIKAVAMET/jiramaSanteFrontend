import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/profile`;

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}`);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}`, data);
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/change-password`, data);
  }

  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ avatarUrl: string }>(`${this.baseUrl}/avatar`, formData);
  }
}
