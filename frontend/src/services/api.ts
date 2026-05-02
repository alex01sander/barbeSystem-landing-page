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
  CreateSaleDTO,
  PublicBookingDTO,
  TransactionType,
  TransactionCategory
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
    .insert([{
      id: crypto.randomUUID(),
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      unit: productData.unit,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
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
  const { items, ...saleInfo } = saleData;
  const saleId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert([{ id: saleId, ...saleInfo, createdAt: now, updatedAt: now }])
    .select()
    .single();
  
  if (saleError) throw saleError;

  if (items && items.length > 0) {
    const itemsWithSaleId = items.map(item => ({
      id: crypto.randomUUID(),
      ...item,
      saleId: sale.id,
      createdAt: now,
      updatedAt: now
    }));
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
  return data as Sale[];
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
    .insert([{
      id: crypto.randomUUID(),
      name: barberData.name,
      age: barberData.age,
      photoUrl: barberData.photoUrl,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
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
    .insert([{
      id: crypto.randomUUID(),
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
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
    .insert([{
      id: crypto.randomUUID(),
      name: serviceData.name,
      description: serviceData.description,
      price: serviceData.price,
      durationMinutes: serviceData.durationMinutes,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
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
  if (barberId) query = query.eq("barber_id", barberId);
  if (startDate) query = query.gte("date", startDate);
  if (endDate) query = query.lte("date", endDate);
  
  const { data, error } = await query.order("date");
  
  if (error) throw error;
  return data as Appointment[];
}

export async function createAppointment(appointmentData: CreateAppointmentDTO): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .insert([{
      id: crypto.randomUUID(),
      clientId: appointmentData.clientId,
      barberId: appointmentData.barberId,
      serviceId: appointmentData.serviceId,
      date: appointmentData.date,
      notes: appointmentData.notes,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
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

  const totalIncomes = (incomes as Pick<FinancialTransaction, 'amount'>[] || []).reduce((sum: number, item) => sum + Number(item.amount), 0);
  const totalExpenses = (expenses as Pick<FinancialTransaction, 'amount'>[] || []).reduce((sum: number, item) => sum + Number(item.amount), 0);

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
  (data as Pick<FinancialTransaction, 'category' | 'type' | 'amount'>[] || []).forEach((item) => {
    const key = `${item.category}|${item.type}`;
    groups[key] = (groups[key] || 0) + Number(item.amount);
  });

  return Object.entries(groups).map(([key, total]) => {
    const [category, type] = key.split("|");
    return { 
      category: category as TransactionCategory, 
      type: type as TransactionType, 
      total 
    };
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
  return data as FinancialTransaction[];
}

export async function createTransaction(transactionData: CreateTransactionDTO): Promise<FinancialTransaction> {
  const { data, error } = await supabase
    .from("financial_transactions")
    .insert([{
      id: crypto.randomUUID(),
      ...transactionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data as FinancialTransaction;
}

/* PUBLIC SITE METHODS */

export async function getAvailableSlots(barberId: string, serviceId: string, date: string): Promise<string[]> {
  // Horário padrão: segunda a sábado, 9h às 18h
  // Domingos (dayOfWeek === 0) não têm atendimento
  const dayOfWeek = new Date(date + 'T12:00:00').getDay(); // Usando meio-dia para evitar problemas de timezone
  if (dayOfWeek === 0) return []; // Domingo sem atendimento

  const START_HOUR = 9;   // 09:00
  const END_HOUR = 18;    // 18:00
  const SLOT_MINUTES = 30; // Slots de 30 minutos

  // Buscar agendamentos existentes para o barbeiro neste dia
  const { data: appointments, error: apptError } = await supabase
    .from("appointments")
    .select("date")
    .eq("barberId", barberId)
    .gte("date", `${date}T00:00:00`)
    .lte("date", `${date}T23:59:59`)
    .neq("status", "CANCELLED");

  if (apptError) throw apptError;

  // Gerar todos os slots do dia
  const slots: string[] = [];
  const startTime = new Date(`${date}T${String(START_HOUR).padStart(2, '0')}:00:00`);
  const endTime = new Date(`${date}T${String(END_HOUR).padStart(2, '0')}:00:00`);
  const current = new Date(startTime);

  // Horários já ocupados
  const busyTimes = new Set(
    (appointments || []).map(a => {
      const d = new Date(a.date);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    })
  );

  while (current < endTime) {
    const timeString = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
    if (!busyTimes.has(timeString)) {
      slots.push(timeString);
    }
    current.setMinutes(current.getMinutes() + SLOT_MINUTES);
  }

  return slots;
}

export async function createPublicAppointment(bookingData: PublicBookingDTO): Promise<Appointment> {
  // 1. Encontrar ou criar o cliente
  let clientId = "";
  const { data: existingClients } = await supabase
    .from("clients")
    .select("id")
    .eq("phone", bookingData.clientPhone)
    .limit(1);
    
  if (existingClients && existingClients.length > 0) {
    clientId = existingClients[0].id;
  } else {
    const { data: newClient, error: clientError } = await supabase
      .from("clients")
      .insert([{
        id: crypto.randomUUID(),
        name: bookingData.clientName,
        phone: bookingData.clientPhone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single();
    if (clientError) throw clientError;
    clientId = newClient.id;
  }

  // 2. Obter preço do serviço
  const { data: service } = await supabase
    .from("services")
    .select("price")
    .eq("id", bookingData.serviceId)
    .single();

  // 3. Combinar date e time
  const combinedDate = new Date(`${bookingData.date}T${bookingData.time}:00`).toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .insert([{
      id: crypto.randomUUID(),
      clientId: clientId,
      barberId: bookingData.barberId,
      serviceId: bookingData.serviceId,
      date: combinedDate,
      totalPrice: service?.price || 0,
      notes: bookingData.notes,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data as Appointment;
}
