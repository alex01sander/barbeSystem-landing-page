export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'BARBER';
}

export interface Barber {
  id: string;
  name: string;
  photoUrl?: string;
  age?: number;
  isActive: boolean;
}

export interface CreateBarberDTO {
  name: string;
  photoUrl?: string;
  age?: number;
}

export interface UpdateBarberDTO {
  name?: string;
  photoUrl?: string;
  age?: number;
  isActive?: boolean;
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

/* PRODUCT TYPES */

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  unit: string;
  isActive: boolean;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  stock: number;
  unit?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  unit?: string;
  isActive?: boolean;
}

/* SALE TYPES */

export interface SaleItem {
  id: string;
  saleId: string;
  type: 'SERVICE' | 'PRODUCT';
  serviceId?: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  barberId: string;
  paymentMethod: string;
  total: number;
  notes?: string;
  createdAt: string;
  barber?: { id: string, name: string };
  items?: SaleItem[];
}

export interface CreateSaleDTO {
  barberId: string;
  paymentMethod: string;
  notes?: string;
  items: {
    type: 'SERVICE' | 'PRODUCT';
    serviceId?: string;
    productId?: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

/* END SALE TYPES */

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

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionCategory = 'SERVICE' | 'PRODUCT' | 'SALARY' | 'RENT' | 'SUPPLY' | 'OTHER' | 'PDV';
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
  saleId?: string;
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

export interface CreateUserDTO {
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'BARBER';
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'BARBER';
}

export interface CreateAppointmentDTO {
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string;
  notes?: string;
}
