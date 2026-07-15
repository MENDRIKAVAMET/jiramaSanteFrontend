export interface Agent {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  directionId: string;
  directionName: string;
  serviceId: string;
  serviceName: string;
  positionId: string;
  positionName: string;
  isActive: boolean;
  hiredAt: string;
  createdAt: string;
  updatedAt: string;
}
