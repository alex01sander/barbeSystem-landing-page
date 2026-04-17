import { prisma } from "../config/prisma";
import { CreateAppointmentDTO, AppointmentStatus } from "../utils/types";

export class AppointmentRepository {
  async findAll(filters: { barberId?: string; clientId?: string; startDate?: Date; endDate?: Date }) {
    return prisma.appointment.findMany({
      where: {
        AND: [
          filters.barberId ? { barberId: filters.barberId } : {},
          filters.clientId ? { clientId: filters.clientId } : {},
          filters.startDate && filters.endDate ? {
            date: {
              gte: filters.startDate,
              lte: filters.endDate
            }
          } : {}
        ]
      },
      include: {
        client: true,
        service: true,
        barber: {
          select: { id: true, name: true }
        }
      },
      orderBy: { date: "asc" }
    });
  }

  async findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: { client: true, service: true, barber: true }
    });
  }

  async create(data: CreateAppointmentDTO & { totalPrice: number }) {
    return prisma.appointment.create({
      data: {
        clientId: data.clientId,
        barberId: data.barberId,
        serviceId: data.serviceId,
        date: new Date(data.date),
        notes: data.notes,
        totalPrice: data.totalPrice,
        status: "PENDING"
      }
    });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    return prisma.appointment.update({
      where: { id },
      data: { status }
    });
  }

  async findOverlapping(barberId: string, start: Date, end: Date) {
    // Busca agendamentos do mesmo barbeiro que não foram cancelados
    // e cujo intervalo (date até date+duration) sobrepõe o novo intervalo [start, end]
    // Obs: Esta é uma verificação simplificada baseada apenas no início, 
    // a lógica completa exigiria somar a duração de cada agendamento existente.
    
    // Para simplificar no MVP, buscaremos qualquer agendamento 
    // em um range de +- 1 hora para verificação detalhada no Service
    return prisma.appointment.findMany({
      where: {
        barberId,
        status: { not: "CANCELLED" },
        date: {
          gte: new Date(start.getTime() - 2 * 60 * 60 * 1000), // -2h
          lte: new Date(end.getTime() + 2 * 60 * 60 * 1000),  // +2h
        }
      },
      include: { service: true }
    });
  }
}
