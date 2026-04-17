export interface LoginDTO {
  email: string;
  password: Buffer | string;
}

export interface CreateServiceDTO {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  price?: number;
  durationMinutes?: number;
  isActive?: boolean;
}

export interface TokenPayload {
  id: string;
  role: string;
  name: string;
}

export interface CreateClientDTO {
  name: string;
  email?: string;
  phone: string;
  birthDate?: Date;
  notes?: string;
}

export interface UpdateClientDTO {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
  notes?: string;
}
