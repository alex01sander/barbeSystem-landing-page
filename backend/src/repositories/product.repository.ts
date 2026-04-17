import { prisma } from "../config/prisma";
import { Prisma } from "../../generated/prisma";

export class ProductRepository {
  async findAll() {
    return prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  }

  async decrementStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }

  async softDelete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
