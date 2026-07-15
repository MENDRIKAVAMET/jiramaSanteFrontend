import { DeclarationStatus } from './enums.model';

export interface Declaration {
  id: string;
  reference: string;
  agentId: string;
  agentName: string;
  status: DeclarationStatus;
  declarationDate: string;
  symptomsSummary: string;
  description: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DeclarationListItem {
  id: string;
  reference: string;
  agentName: string;
  status: DeclarationStatus;
  declarationDate: string;
}
