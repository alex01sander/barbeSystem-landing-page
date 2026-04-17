import { FinancialRepository } from "../repositories/financial.repository";
import { CreateTransactionDTO, FinancialSummaryDTO, TransactionType } from "../utils/types";

const financialRepository = new FinancialRepository();

export class FinancialService {
  async list(filters: { dateStart?: string; dateEnd?: string; type?: TransactionType }) {
    const startDate = filters.dateStart ? new Date(filters.dateStart) : undefined;
    const endDate = filters.dateEnd ? new Date(filters.dateEnd) : undefined;

    return financialRepository.findAll({
      startDate,
      endDate,
      type: filters.type
    });
  }

  async create(data: CreateTransactionDTO) {
    if (data.amount <= 0) {
      throw new Error("O valor da transação deve ser maior que zero");
    }
    return financialRepository.create(data);
  }

  async getSummary(dateStart: string, dateEnd: string): Promise<FinancialSummaryDTO> {
    const start = new Date(dateStart);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(dateEnd);
    end.setHours(23, 59, 59, 999);

    const stats = await financialRepository.getStats(start, end);

    let totalIncomes = 0;
    let totalExpenses = 0;

    stats.forEach(stat => {
      const sum = Number(stat._sum.amount || 0);
      if (stat.type === "INCOME") totalIncomes = sum;
      if (stat.type === "EXPENSE") totalExpenses = sum;
    });

    return {
      totalIncomes,
      totalExpenses,
      balance: totalIncomes - totalExpenses,
      period: { start, end }
    };
  }

  async getReports(dateStart: string, dateEnd: string) {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    const grouped = await financialRepository.getGroupedByCategory(start, end);

    // Formatar para um objeto mais amigável para o frontend
    return grouped.map(item => ({
      category: item.category,
      type: item.type,
      total: Number(item._sum.amount || 0)
    }));
  }
}
