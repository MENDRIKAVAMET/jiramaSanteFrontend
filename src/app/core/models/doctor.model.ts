import { WithAccount } from './api.model';

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

/**
 * Payload d'entrée pour la création d'un médecin : inclut un mot de passe
 * optionnel pour le compte utilisateur associé (généré automatiquement
 * si non fourni).
 */
export type CreateDoctorPayload = Omit<Doctor, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & {
  password?: string;
};

/**
 * Réponse renvoyée par le backend après création d'un médecin : le médecin
 * créé accompagné des informations du compte utilisateur associé.
 */
export type DoctorCreationResult = WithAccount<Doctor>;
