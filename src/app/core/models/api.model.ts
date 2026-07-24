export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  details?: Record<string, unknown>;
}

/**
 * Informations sur le compte utilisateur créé automatiquement
 * (ex: lors de la création d'un agent ou d'un médecin).
 */
export interface CreatedAccountInfo {
  email: string;
  temporaryPassword: string;
}

/**
 * Enveloppe générique pour une entité renvoyée avec les informations
 * du compte utilisateur créé en même temps qu'elle.
 */
export type WithAccount<T> = T & { account: CreatedAccountInfo };
