import { prisma } from "../config/prisma";
import { CreateTransactionDTO, TransactionType } from "../utils/types";

export class FinancialRepository {
  async findAll(filters: { startDate?: Date; endDate?: Date; type?: TransactionType }) {
    return prisma.financialTransaction.findMany({
      where: {
        AND: [
          filters.type ? { type: filters.type } : {},
          filters.startDate && filters.endDate ? {
            date: {
              gte: filters.startDate,
              lte: filters.endDate
            }
          } : {}
        ]
      },
      orderBy: { date: "desc" },
      include: {
        appointment: {
          include: {
            client: { select: { name: true } },
            service: { select: { name: true } }
          }
        }
      }
    });
  }

  async create(data: CreateTransactionDTO) {
    return prisma.financialTransaction.create({
      data: {
        type: data.type,
        category: data.category,
        description: data.description,
        amount: data.amount,
        date: new Date(data.date),
        paymentMethod: data.paymentMethod,
        appointmentId: data.appointmentId,
        userId: data.userId
      }
    });
  }

  async getStats(startDate: Date, endDate: Date) {
    const aggregations = await prisma.financialTransaction.groupBy({
      by: ["type"],
      _sum: {
        amount: true
      },
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    return aggregations;
  }

  async getGroupedByCategory(startDate: Date, endDate: Date) {
    const aggregations = await prisma.financialTransaction.groupBy({
      by: ["category", "type"],
      _sum: {
        amount: true
      },
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    return aggregations;
  }
}
