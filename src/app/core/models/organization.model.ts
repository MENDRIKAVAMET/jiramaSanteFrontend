export interface Direction {
  id: string;
  code: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  code: string | null;
  name: string;
  directionId?: string | null;
  direction?: Direction | null;
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  code: string | null;
  title: string;
  serviceId?: string | null;
  service?: Service | null;
  createdAt: string;
  updatedAt: string;
}
