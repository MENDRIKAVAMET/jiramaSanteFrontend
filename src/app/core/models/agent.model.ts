import { Direction } from './organization.model';
import { Service } from './organization.model';
import { Position } from './organization.model';
import { WithAccount } from './api.model';

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

/**
 * Payload d'entrée pour la création d'un agent : inclut un mot de passe
 * optionnel pour le compte utilisateur associé (généré automatiquement
 * si non fourni).
 */
export type CreateAgentPayload = Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'service' | 'direction' | 'position'> & {
  password?: string;
};

/**
 * Réponse renvoyée par le backend après création d'un agent : l'agent
 * créé accompagné des informations du compte utilisateur associé.
 */
export type AgentCreationResult = WithAccount<Agent>;
