import { api } from "@/lib/api";
import { 
  User, 
  Client, 
  Service, 
  Appointment, 
  CreateAppointmentDTO,
  CreateClientDTO,
  UpdateClientDTO,
  CreateServiceDTO,
  UpdateServiceDTO,
  FinancialTransaction,
  FinancialSummary,
  FinancialReport,
  CreateTransactionDTO,
  CreateUserDTO,
  UpdateUserDTO,
  Barber,
  CreateBarberDTO,
  UpdateBarberDTO,
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  Sale,
  CreateSaleDTO
} from "@/types";

/* PRODUCT METHODS */

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get("/products");
  return data;
}

export async function createProduct(productData: CreateProductDTO): Promise<Product> {
  const { data } = await api.post("/products", productData);
  return data;
}

export async function updateProduct(id: string, productData: UpdateProductDTO): Promise<Product> {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

/* SALE METHODS (PDV) */

export async function createSale(saleData: CreateSaleDTO): Promise<Sale> {
  const { data } = await api.post("/sales", saleData);
  return data;
}

export async function getSales(): Promise<Sale[]> {
  const { data } = await api.get("/sales");
  return data;
}

/* BARBER METHODS */

export async function getBarbers(): Promise<Barber[]> {
  const { data } = await api.get("/barbers");
  return data;
}

export async function createBarber(barberData: CreateBarberDTO): Promise<Barber> {
  const { data } = await api.post("/barbers", barberData);
  return data;
}

export async function updateBarber(id: string, barberData: UpdateBarberDTO): Promise<Barber> {
  const { data } = await api.put(`/barbers/${id}`, barberData);
  return data;
}

export async function deleteBarber(id: string): Promise<void> {
  await api.delete(`/barbers/${id}`);
}

/* USER METHODS (Admins) */

export async function getAllUsers(): Promise<User[]> {
  const { data } = await api.get("/users");
  return data;
}

export async function createUser(userData: CreateUserDTO): Promise<User> {
  const { data } = await api.post("/users", userData);
  return data;
}

export async function updateUser(id: string, userData: UpdateUserDTO): Promise<User> {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
}

/* CLIENT METHODS */

export async function getClients(): Promise<Client[]> {
  const { data } = await api.get("/clients");
  return data;
}

export async function createClient(clientData: CreateClientDTO): Promise<Client> {
  const { data } = await api.post("/clients", clientData);
  return data;
}

export async function updateClient(id: string, clientData: UpdateClientDTO): Promise<Client> {
  const { data } = await api.put(`/clients/${id}`, clientData);
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`);
}

/* SERVICE METHODS */

export async function getServices(): Promise<Service[]> {
  const { data } = await api.get("/services");
  return data;
}

export async function createService(serviceData: CreateServiceDTO): Promise<Service> {
  const { data } = await api.post("/services", serviceData);
  return data;
}

export async function updateService(id: string, serviceData: UpdateServiceDTO): Promise<Service> {
  const { data } = await api.put(`/services/${id}`, serviceData);
  return data;
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/services/${id}`);
}

/* APPOINTMENT METHODS */

export async function getAppointments(date?: string, barberId?: string, startDate?: string, endDate?: string): Promise<Appointment[]> {
  const params: any = { date };
  if (barberId) params.barberId = barberId;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const { data } = await api.get("/appointments", { params });
  return data;
}

export async function createAppointment(appointmentData: CreateAppointmentDTO): Promise<Appointment> {
  const { data } = await api.post("/appointments", appointmentData);
  return data;
}

export async function updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
  const { data } = await api.patch(`/appointments/${id}/status`, { status });
  return data;
}

/* FINANCIAL METHODS */

export async function getFinancialSummary(start: string, end: string): Promise<FinancialSummary> {
  const { data } = await api.get("/financial/summary", {
    params: { start, end }
  });
  return data;
}

export async function getFinancialReports(start: string, end: string): Promise<FinancialReport[]> {
  const { data } = await api.get("/financial/reports", {
    params: { start, end }
  });
  return data;
}

export async function getTransactions(start: string, end: string): Promise<FinancialTransaction[]> {
  const { data } = await api.get("/financial", {
    params: { start, end }
  });
  return data;
}

export async function createTransaction(transactionData: CreateTransactionDTO): Promise<FinancialTransaction> {
  const { data } = await api.post("/financial", transactionData);
  return data;
}
