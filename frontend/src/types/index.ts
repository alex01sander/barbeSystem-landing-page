export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'BARBER';
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface CreateServiceDTO {
  name: string;
  price: number;
  durationMinutes: number;
}

export interface UpdateServiceDTO {
  name?: string;
  price?: number;
  durationMinutes?: number;
  isActive?: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string;
  status: AppointmentStatus;
  totalPrice: number;
  notes?: string;
  client: Client;
  service: Service;
  barber: {
    id: string;
    name: string;
  };
}

export interface CreateClientDTO {
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  notes?: string;
}

export interface UpdateClientDTO {
  name?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  notes?: string;
}
