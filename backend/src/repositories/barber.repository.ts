import { prisma } from "../config/prisma";
import { Prisma } from "../../generated/prisma";

export class BarberRepository {
  async findAll() {
    return prisma.barber.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.barber.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            client: true,
            service: true
          }
        }
      }
    });
  }

  async create(data: Prisma.BarberCreateInput) {
    return prisma.barber.create({
      data,
    });
  }

  async update(id: string, data: Prisma.BarberUpdateInput) {
    return prisma.barber.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.barber.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
