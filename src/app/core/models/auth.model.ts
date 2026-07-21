import { UserRole } from './enums.model';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  matricule: string;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn?: number;
}

export interface AuthSession {
  user?: User;
  tokens: AuthTokens;
}
