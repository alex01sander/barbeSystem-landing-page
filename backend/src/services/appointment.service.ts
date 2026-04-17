import { AppointmentRepository } from "../repositories/appointment.repository";
import { ServiceRepository } from "../repositories/service.repository";
import { ClientRepository } from "../repositories/client.repository";
import { CreateAppointmentDTO, AppointmentStatus } from "../utils/types";

const appointmentRepository = new AppointmentRepository();
const serviceRepository = new ServiceRepository();
const clientRepository = new ClientRepository();

export class AppointmentService {
  async list(filters: { barberId?: string; clientId?: string; date?: string }) {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (filters.date) {
      startDate = new Date(filters.date);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(filters.date);
      endDate.setHours(23, 59, 59, 999);
    }

    return appointmentRepository.findAll({
      ...filters,
      startDate,
      endDate
    });
  }

  async create(data: CreateAppointmentDTO) {
    // 1. Validar Cliente
    const client = await clientRepository.findById(data.clientId);
    if (!client) throw new Error("Cliente não encontrado");

    // 2. Validar Serviço e pegar preço/duração
    const service = await serviceRepository.findById(data.serviceId);
    if (!service) throw new Error("Serviço não encontrado");

    // 3. Definir horários
    const appointmentDate = new Date(data.date);
    const endDate = new Date(appointmentDate.getTime() + service.durationMinutes * 60000);

    // 4. Verificar conflitos de horário para o barbeiro
    const existingAppointments = await appointmentRepository.findOverlapping(
      data.barberId,
      appointmentDate,
      endDate
    );

    const hasConflict = existingAppointments.some(appt => {
      const apptStart = new Date(appt.date);
      const apptEnd = new Date(apptStart.getTime() + appt.service.durationMinutes * 60000);

      // Lógica de sobreposição de intervalos: [start1, end1] vs [start2, end2]
      // Há sobreposição se (start1 < end2) AND (end1 > start2)
      return appointmentDate < apptEnd && endDate > apptStart;
    });

    if (hasConflict) {
      throw new Error("O barbeiro já possui um agendamento neste horário");
    }

    // 5. Criar agendamento
    return appointmentRepository.create({
      ...data,
      totalPrice: Number(service.price)
    });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) throw new Error("Agendamento não encontrado");

    return appointmentRepository.updateStatus(id, status);
  }
}
