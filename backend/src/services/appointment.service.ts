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

  async getAvailableSlots(barberId: string, serviceId: string, date: string) {
    const service = await serviceRepository.findById(serviceId);
    if (!service) throw new Error("Serviço não encontrado");

    const startTime = 8; // 08:00
    const endTime = 20; // 20:00
    const slots: string[] = [];

    // Gerar slots de 30 em 30 minutos
    for (let hour = startTime; hour < endTime; hour++) {
      for (let min of [0, 30]) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
        const slotDate = new Date(`${date}T${timeStr}:00`);
        
        // Calcular quando o serviço terminaria se começasse neste slot
        const slotEndDate = new Date(slotDate.getTime() + service.durationMinutes * 60000);

        // Verificar se este slot colide com algum agendamento existente
        const conflicts = await appointmentRepository.findOverlapping(barberId, slotDate, slotEndDate);
        
        const hasConflict = conflicts.some(appt => {
          const apptStart = new Date(appt.date);
          const apptEnd = new Date(apptStart.getTime() + appt.service.durationMinutes * 60000);
          return slotDate < apptEnd && slotEndDate > apptStart;
        });

        if (!hasConflict) {
          slots.push(timeStr);
        }
      }
    }

    return slots;
  }

  async createPublicAppointment(data: {
    clientName: string;
    clientPhone: string;
    barberId: string;
    serviceId: string;
    date: string;
    time: string;
  }) {
    // 1. Validar disponibilidade novamente (concorrência)
    const appointmentDate = new Date(`${data.date}T${data.time}:00`);
    const service = await serviceRepository.findById(data.serviceId);
    if (!service) throw new Error("Serviço não encontrado");

    const appointmentEndDate = new Date(appointmentDate.getTime() + service.durationMinutes * 60000);
    const conflicts = await appointmentRepository.findOverlapping(data.barberId, appointmentDate, appointmentEndDate);
    
    const hasConflict = conflicts.some(appt => {
      const apptStart = new Date(appt.date);
      const apptEnd = new Date(apptStart.getTime() + appt.service.durationMinutes * 60000);
      return appointmentDate < apptEnd && appointmentEndDate > apptStart;
    });

    if (hasConflict) throw new Error("Horário não disponível");

    // 2. Buscar ou criar cliente
    let client = await clientRepository.findByPhone(data.clientPhone);
    if (!client) {
      client = await clientRepository.create({
        name: data.clientName,
        phone: data.clientPhone
      });
    }

    // 3. Criar agendamento (via método existente adaptado ou repo direto)
    return appointmentRepository.create({
      clientId: client.id,
      barberId: data.barberId,
      serviceId: data.serviceId,
      date: appointmentDate.toISOString(),
      totalPrice: Number(service.price)
    });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) throw new Error("Agendamento não encontrado");

    const updated = await appointmentRepository.updateStatus(id, status);

    // Se o status for concluído, lança automaticamente no financeiro
    if (status === "COMPLETED") {
       // Note: appointmentRepository should handle prisma access or use a service
       // For now, continuing the pattern found in the file
       const { prisma } = require("../config/prisma"); 
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
