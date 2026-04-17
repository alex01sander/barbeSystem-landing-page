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
  UpdateServiceDTO
} from "@/types";

export async function getBarbers(): Promise<User[]> {
  const { data } = await api.get("/users?role=BARBER");
  return data;
}

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

export async function getAppointments(date?: string): Promise<Appointment[]> {
  const { data } = await api.get("/appointments", {
    params: { date }
  });
  return data;
}

export async function createAppointment(appointmentData: CreateAppointmentDTO): Promise<Appointment> {
  const { data } = await api.post("/appointments", appointmentData);
  return data;
}

export async function updateAppointmentStatus(id: string, status: string) {
  const { data } = await api.patch(`/appointments/${id}/status`, { status });
  return data;
}
