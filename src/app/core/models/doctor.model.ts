export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  specialization: string;
  licenseNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
