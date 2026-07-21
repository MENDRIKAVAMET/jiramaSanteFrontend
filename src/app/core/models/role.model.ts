export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: readonly string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
