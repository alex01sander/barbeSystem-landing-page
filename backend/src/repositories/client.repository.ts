import { prisma } from "../config/prisma";
import { CreateClientDTO, UpdateClientDTO } from "../utils/types";

export class ClientRepository {
  async findAll(search?: string) {
    return prisma.client.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { phone: { contains: search } }
        ]
      } : {},
      orderBy: { name: "asc" }
    });
  }

  async findById(id: string) {
    return prisma.client.findUnique({
      where: { id }
    });
  }

  async findByPhone(phone: string) {
    return prisma.client.findUnique({
      where: { phone }
    });
  }

  async findByEmail(email: string) {
    return prisma.client.findUnique({
      where: { email }
    });
  }

  async create(data: CreateClientDTO) {
    return prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        notes: data.notes
      }
    });
  }

  async update(id: string, data: UpdateClientDTO) {
    return prisma.client.update({
      where: { id },
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined
      }
    });
  }

  async delete(id: string) {
    return prisma.client.delete({
      where: { id }
    });
  }

  async getHistory(clientId: string) {
    return prisma.appointment.findMany({
      where: { clientId },
      include: {
        service: true,
        barber: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { date: "desc" }
    });
  }
}
