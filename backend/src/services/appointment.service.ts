import { AppointmentRepository } from "../repositories/appointment.repository";
import { ServiceRepository } from "../repositories/service.repository";
import { ClientRepository } from "../repositories/client.repository";
import { CreateAppointmentDTO, AppointmentStatus } from "../utils/types";

const appointmentRepository = new AppointmentRepository();
const serviceRepository = new ServiceRepository();
const clientRepository = new ClientRepository();

export class AppointmentService {
  async list(filters: { barberId?: string; clientId?: string; date?: string; startDate?: string; endDate?: string }) {
    let start: Date | undefined;
    let end: Date | undefined;

    if (filters.startDate && filters.endDate) {
      start = new Date(filters.startDate);
      end = new Date(filters.endDate);
    } else if (filters.date) {
      start = new Date(filters.date);
      start.setHours(0, 0, 0, 0);
      
      end = new Date(filters.date);
      end.setHours(23, 59, 59, 999);
    }

    return appointmentRepository.findAll({
      ...filters,
      startDate: start,
      endDate: end
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

    const updated = await appointmentRepository.updateStatus(id, status);

    // Se o status for concluído, lança automaticamente no financeiro
    if (status === "COMPLETED") {
       await prisma.financialTransaction.create({
         data: {
           type: "INCOME",
           category: "SERVICE",
           amount: Number(appointment.totalPrice),
           description: `Serviço: ${appointment.service.name} — Cliente: ${appointment.client.name}`,
           date: new Date(),
           appointmentId: appointment.id
         }
       });
    }

    return updated;
  }
}
