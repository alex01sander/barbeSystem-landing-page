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

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionCategory = 'SERVICE' | 'PRODUCT' | 'SALARY' | 'RENT' | 'SUPPLY' | 'OTHER';
export type PaymentMethod = 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  date: string;
  paymentMethod?: PaymentMethod;
  appointmentId?: string;
  client?: { name: string };
  service?: { name: string };
}

export interface FinancialSummary {
  totalIncomes: number;
  totalExpenses: number;
  balance: number;
  period: {
    start: string;
    end: string;
  };
}

export interface FinancialReport {
  category: TransactionCategory;
  type: TransactionType;
  total: number;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  date: string;
  paymentMethod?: PaymentMethod;
}
