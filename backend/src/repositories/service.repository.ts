import { prisma } from "../config/prisma";
import { CreateServiceDTO, UpdateServiceDTO } from "../utils/types";

export class ServiceRepository {
  async findAll(onlyActive: boolean = true) {
    return prisma.service.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.service.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return prisma.service.findFirst({
      where: { name },
    });
  }

  async create(data: CreateServiceDTO) {
    return prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        durationMinutes: data.durationMinutes,
      },
    });
  }

  async update(id: string, data: UpdateServiceDTO) {
    return prisma.service.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    // Soft delete por padrão
    return prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
