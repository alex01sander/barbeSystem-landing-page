import { supabase } from "@/lib/supabase";
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
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name");
  
  if (error) throw error;
  return data as Product[];
}

export async function createProduct(productData: CreateProductDTO): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, productData: UpdateProductDTO): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}

/* SALE METHODS (PDV) */

export async function createSale(saleData: CreateSaleDTO): Promise<Sale> {
  // Nota: O Express lidava com a inserção em cascata (Sale + SaleItems).
  // No Supabase, se não houver triggers/functions, precisamos fazer em duas etapas ou via RPC.
  // Por simplicidade aqui, fazemos em duas etapas se houver itens.
  
  const { items, ...saleInfo } = saleData;
  
  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert([saleInfo])
    .select()
    .single();
  
  if (saleError) throw saleError;

  if (items && items.length > 0) {
    const itemsWithSaleId = items.map(item => ({ ...item, saleId: sale.id }));
    const { error: itemsError } = await supabase
      .from("sale_items")
      .insert(itemsWithSaleId);
    
    if (itemsError) throw itemsError;
  }
  
  return sale as Sale;
}

export async function getSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from("sales")
    .select("*, barber:barbers(id, name), items:sale_items(*)")
    .order("createdAt", { ascending: false });
  
  if (error) throw error;
  return data as any[];
}

/* BARBER METHODS */

export async function getBarbers(): Promise<Barber[]> {
  const { data, error } = await supabase
    .from("barbers")
    .select("*")
    .order("name");
  
  if (error) throw error;
  return data as Barber[];
}

export async function createBarber(barberData: CreateBarberDTO): Promise<Barber> {
  const { data, error } = await supabase
    .from("barbers")
    .insert([barberData])
    .select()
    .single();
  
  if (error) throw error;
  return data as Barber;
}

export async function updateBarber(id: string, barberData: UpdateBarberDTO): Promise<Barber> {
  const { data, error } = await supabase
    .from("barbers")
    .update(barberData)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Barber;
}

export async function deleteBarber(id: string): Promise<void> {
  const { error } = await supabase
    .from("barbers")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}

/* USER METHODS (Admins) */

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name");
  
  if (error) throw error;
  return data as User[];
}

export async function createUser(userData: CreateUserDTO): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();
  
  if (error) throw error;
  return data as User;
}

export async function updateUser(id: string, userData: UpdateUserDTO): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data as User;
}

/* CLIENT METHODS */

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");
  
  if (error) throw error;
  return data as Client[];
}

export async function createClient(clientData: CreateClientDTO): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .insert([clientData])
    .select()
    .single();
  
  if (error) throw error;
  return data as Client;
}

export async function updateClient(id: string, clientData: UpdateClientDTO): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .update(clientData)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Client;
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}

/* SERVICE METHODS */

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("name");
  
  if (error) throw error;
  return data as Service[];
}

export async function createService(serviceData: CreateServiceDTO): Promise<Service> {
  const { data, error } = await supabase
    .from("services")
    .insert([serviceData])
    .select()
    .single();
  
  if (error) throw error;
  return data as Service;
}

export async function updateService(id: string, serviceData: UpdateServiceDTO): Promise<Service> {
  const { data, error } = await supabase
    .from("services")
    .update(serviceData)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Service;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}

/* APPOINTMENT METHODS */

export async function getAppointments(date?: string, barberId?: string, startDate?: string, endDate?: string): Promise<Appointment[]> {
  let query = supabase
    .from("appointments")
    .select("*, client:clients(*), service:services(*), barber:barbers(id, name)");

  if (date) query = query.eq("date", date);
  if (barberId) query = query.eq("barberId", barberId);
  if (startDate) query = query.gte("date", startDate);
  if (endDate) query = query.lte("date", endDate);
  
  const { data, error } = await query.order("date");
  
  if (error) throw error;
  return data as any[];
}

export async function createAppointment(appointmentData: CreateAppointmentDTO): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .insert([appointmentData])
    .select()
    .single();
  
  if (error) throw error;
  return data as Appointment;
}

export async function updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Appointment;
}

/* FINANCIAL METHODS */

export async function getFinancialSummary(start: string, end: string): Promise<FinancialSummary> {
  // Nota: Esta lógica era processada no Express. 
  // No Supabase puramente client-side, precisaríamos buscar tudo e calcular no front, 
  // ou chamar um RPC (Database Function).
  // Por agora, buscaremos os dados brutos e calcularemos.
  
  const { data: incomes, error: incError } = await supabase
    .from("financial_transactions")
    .select("amount")
    .eq("type", "INCOME")
    .gte("date", start)
    .lte("date", end);

  const { data: expenses, error: expError } = await supabase
    .from("financial_transactions")
    .select("amount")
    .eq("type", "EXPENSE")
    .gte("date", start)
    .lte("date", end);

  if (incError || expError) throw (incError || expError);

  const totalIncomes = incomes.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return {
    totalIncomes,
    totalExpenses,
    balance: totalIncomes - totalExpenses,
    period: { start, end }
  };
}

export async function getFinancialReports(start: string, end: string): Promise<FinancialReport[]> {
  const { data, error } = await supabase
    .from("financial_transactions")
    .select("category, type, amount")
    .gte("date", start)
    .lte("date", end);

  if (error) throw error;

  // Agrupamento por categoria e tipo
  const groups: Record<string, number> = {};
  data.forEach(item => {
    const key = `${item.category}|${item.type}`;
    groups[key] = (groups[key] || 0) + Number(item.amount);
  });

  return Object.entries(groups).map(([key, total]) => {
    const [category, type] = key.split("|");
    return { category, type, total } as any;
  });
}

export async function getTransactions(start: string, end: string): Promise<FinancialTransaction[]> {
  const { data, error } = await supabase
    .from("financial_transactions")
    .select("*, client:clients(name), service:services(name)")
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false });

  if (error) throw error;
  return data as any[];
}

export async function createTransaction(transactionData: CreateTransactionDTO): Promise<FinancialTransaction> {
  const { data, error } = await supabase
    .from("financial_transactions")
    .insert([transactionData])
    .select()
    .single();

  if (error) throw error;
  return data as FinancialTransaction;
}

/* PUBLIC SITE METHODS */

export async function getAvailableSlots(barberId: string, serviceId: string, date: string): Promise<string[]> {
  // Nota: Lógica complexa que exige saber horários de funcionamento e agendamentos existentes.
  // No Express isso era calculado. Aqui vamos precisar de uma lógica similar no client ou RPC.
  
  const { data: schedule, error: schedError } = await supabase
    .from("barber_schedules")
    .select("*")
    .eq("barberId", barberId)
    .eq("dayOfWeek", new Date(date).getDay())
    .single();

  if (schedError || !schedule || !schedule.isWorking) return [];

  const { data: appointments, error: apptError } = await supabase
    .from("appointments")
    .select("date, service:services(durationMinutes)")
    .eq("barberId", barberId)
    .gte("date", `${date}T00:00:00Z`)
    .lte("date", `${date}T23:59:59Z`);

  if (apptError) throw apptError;

  // Lógica simplificada de slots (ex: a cada 30 min)
  const slots: string[] = [];
  let current = new Date(`${date}T${schedule.startTime}:00`);
  const end = new Date(`${date}T${schedule.endTime}:00`);

  while (current < end) {
    const timeString = current.toTimeString().substring(0, 5);
    // Verificar se o slot está livre
    const isBusy = appointments.some(a => {
        const aStart = new Date(a.date).toTimeString().substring(0, 5);
        return aStart === timeString;
    });

    if (!isBusy) slots.push(timeString);
    current.setMinutes(current.getMinutes() + 30);
  }

  return slots;
}

export async function createPublicAppointment(bookingData: any) {
  const { data, error } = await supabase
    .from("appointments")
    .insert([bookingData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
