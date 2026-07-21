import { Direction } from './organization.model';
import { Service } from './organization.model';
import { Position } from './organization.model';

export interface Agent {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  hireDate: string;
  poste: string;
  serviceId?: string | null;
  directionId?: string | null;
  positionId?: string | null;
  service?: Service | null;
  direction?: Direction | null;
  position?: Position | null;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
}
