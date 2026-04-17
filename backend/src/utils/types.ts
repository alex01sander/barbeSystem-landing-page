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

import { 
  AppointmentStatus, 
  TransactionType, 
  TransactionCategory, 
  PaymentMethod 
} from "../../generated/prisma";

export { 
  AppointmentStatus, 
  TransactionType, 
  TransactionCategory, 
  PaymentMethod 
};

export interface CreateAppointmentDTO {
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string | Date; // ISO string or Date object
  notes?: string;
}

export interface UpdateAppointmentStatusDTO {
  status: AppointmentStatus;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  date: string | Date;
  paymentMethod?: PaymentMethod;
  appointmentId?: string;
  userId?: string;
}

export interface FinancialSummaryDTO {
  totalIncomes: number;
  totalExpenses: number;
  balance: number;
  period: {
    start: Date;
    end: Date;
  };
}
