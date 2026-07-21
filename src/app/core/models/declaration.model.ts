import { Agent } from './agent.model';
import { Doctor } from './doctor.model';
import { DeclarationPriority, DeclarationStatus, DeclarationType } from './enums.model';
import { Symptom } from './symptom.model';

export interface Declaration {
  id: string;
  number: string;
  date: string;
  type: DeclarationType;
  subject: string;
  description: string;
  priority: DeclarationPriority;
  status: DeclarationStatus;
  agentId: string;
  agent?: Agent;
  doctorId?: string | null;
  doctor?: Doctor | null;
  symptoms?: { symptom: Symptom }[];
  createdAt: string;
  updatedAt: string;
}

/** Version aplatie utilisée par les tableaux de la liste des déclarations. */
export interface DeclarationListItem {
  id: string;
  reference: string;
  agentName: string;
  status: DeclarationStatus;
  declarationDate: string;
}
