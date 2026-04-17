import { prisma } from "../config/prisma";
import { Prisma } from "../../generated/prisma";

export class SaleRepository {
  async create(data: {
    barberId: string;
    paymentMethod: string;
    total: number | Prisma.Decimal;
    notes?: string;
    items: any[];
  }) {
    return prisma.sale.create({
      data: {
        barberId: data.barberId,
        paymentMethod: data.paymentMethod,
        total: data.total,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            type: item.type,
            serviceId: item.serviceId,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        items: true,
        barber: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findAll() {
    return prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        barber: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.sale.findUnique({
      where: { id },
      include: {
        items: true,
        barber: {
          select: { id: true, name: true },
        },
      },
    });
  }
}
