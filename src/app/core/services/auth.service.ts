import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { AuthCredentials, AuthSession, AuthTokens, User, UserRole } from '../models';
import { APP_CONSTANTS } from '../constants';

interface JwtPayload {
  sub: string;
  role: UserRole;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly _currentUser = signal<User | null>(null);
  private readonly _tokens = signal<AuthTokens | null>(null);
  private readonly _initializing = signal(true);
  private readonly _mustChangePassword = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly tokens = this._tokens.asReadonly();
  readonly initializing = this._initializing.asReadonly();
  readonly mustChangePassword = this._mustChangePassword.asReadonly();

  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly userRole = computed<UserRole | null>(() => this._currentUser()?.role ?? null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ADMINISTRATEUR');
  readonly isMedecin = computed(() => this._currentUser()?.role === 'MEDECIN');
  readonly isAgent = computed(() => this._currentUser()?.role === 'AGENT');

  constructor() {
    this.restoreSession();
  }

  login(credentials: AuthCredentials): Observable<{ access_token: string; mustChangePassword: boolean }> {
    return this.http.post<{ access_token: string; mustChangePassword: boolean }>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        const token = res.access_token;
        this.persistTokens({ accessToken: token });
        this._mustChangePassword.set(!!res.mustChangePassword);
        const payload = this.decodeJwt(token);
        if (payload) {
          // Le JWT ne contient que sub/role/exp/iat : on pose un utilisateur minimal
          // tout de suite (pour ne pas bloquer l'UI), puis on va chercher le vrai
          // profil (prénom, nom, matricule, etc.) qui vit en base.
          const user = this.buildUserFromJwt(payload);
          if (user) this._currentUser.set(user);
        }
        this.fetchAndSetProfile();
      }),
    );
  }

  /** Recharge le profil complet (prénom, nom, matricule...) depuis /profile. */
  private fetchAndSetProfile(): void {
    this.http.get<User>(`${environment.apiUrl}/profile`).subscribe({
      next: (profile) => {
        this._currentUser.set(profile);
        if (typeof profile.mustChangePassword === 'boolean') {
          this._mustChangePassword.set(profile.mustChangePassword);
        }
      },
      error: () => {
        // On garde l'utilisateur minimal décodé du JWT si /profile échoue.
      },
    });
  }

  /** Appelé après un changement de mot de passe réussi pour lever la contrainte. */
  clearMustChangePassword(): void {
    this._mustChangePassword.set(false);
  }

  logout(): void {
    this.clearSession();
  }

  getAccessToken(): string | null {
    return this._tokens()?.accessToken ?? localStorage.getItem(APP_CONSTANTS.tokenStorageKey);
  }

  getRefreshToken(): string | null {
    return null;
  }

  hasRole(...roles: UserRole[]): boolean {
    const user = this._currentUser();
    return user !== null && roles.includes(user.role);
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    const payload = this.decodeJwt(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  private restoreSession(): void {
    const accessToken = localStorage.getItem(APP_CONSTANTS.tokenStorageKey);

    if (accessToken) {
      const payload = this.decodeJwt(accessToken);
      if (payload && !this.isJwtExpired(payload)) {
        this._tokens.set({ accessToken, expiresIn: payload.exp - payload.iat });
        const user = this.buildUserFromJwt(payload);
        if (user) this._currentUser.set(user);
        this.fetchAndSetProfile();
      } else {
        this.clearSession();
      }
    }
    this._initializing.set(false);
  }

  private setSession(session: AuthSession): void {
    if (session.user) this._currentUser.set(session.user);
    this.persistTokens(session.tokens);
  }

  private persistTokens(tokens: AuthTokens): void {
    this._tokens.set(tokens);
    localStorage.setItem(APP_CONSTANTS.tokenStorageKey, tokens.accessToken);
  }

  public clearSession(): void {
    this._currentUser.set(null);
    this._tokens.set(null);
    this._mustChangePassword.set(false);
    localStorage.removeItem(APP_CONSTANTS.tokenStorageKey);
  }

  private decodeJwt(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = atob(parts[1].replaceAll('-', '+').replaceAll('_', '/'));
      return JSON.parse(payload) as JwtPayload;
    } catch {
      return null;
    }
  }

  private isJwtExpired(payload: JwtPayload): boolean {
    if (!payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  private buildUserFromJwt(payload: JwtPayload): User | null {
    if (!payload.sub || !payload.role) return null;
    return {
      id: payload.sub, email: '', firstName: '', lastName: '', matricule: '',
      phone: null, role: payload.role, avatarUrl: null, isActive: true,
      lastLoginAt: null, createdAt: '', updatedAt: '',
    };
  }
}
