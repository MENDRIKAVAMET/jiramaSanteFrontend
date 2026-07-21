export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  specialty: string;
  registrationNumber: string;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
}
