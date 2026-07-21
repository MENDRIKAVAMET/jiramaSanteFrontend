import { UserRole } from './enums.model';

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  specialty?: string;
  registrationNumber?: string;
  hireDate?: string;
  matricule?: string;
  createdAt: string;
  updatedAt: string;
}
