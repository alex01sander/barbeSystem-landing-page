import { prisma } from "../config/prisma";
import { SaleRepository } from "../repositories/sale.repository";
import { ProductRepository } from "../repositories/product.repository";

const saleRepository = new SaleRepository();
const productRepository = new ProductRepository();

type SaleItemInput = {
  type: "SERVICE" | "PRODUCT";
  serviceId?: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
};

export class SaleService {
  async createSale(data: {
    barberId: string;
    paymentMethod: string;
    notes?: string;
    items: SaleItemInput[];
  }) {
    // 1. Valida estoque dos produtos
    for (const item of data.items) {
      if (item.type === "PRODUCT" && item.productId) {
        const product = await productRepository.findById(item.productId);
        if (!product) throw new Error(`Produto não encontrado: ${item.name}`);
        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para: ${product.name}`);
        }
      }
    }

    // 2. Monta os itens com subtotal
    const itemsWithSubtotal = data.items.map((item) => ({
      ...item,
      subtotal: item.price * item.quantity,
    }));

    // 3. Calcula total
    const total = itemsWithSubtotal.reduce((sum, i) => sum + i.subtotal, 0);

    // Usar uma transação do Prisma para garantir atomicidade
    return await prisma.$transaction(async (tx) => {
      // 4. Cria a venda
      const sale = await tx.sale.create({
        data: {
          barberId: data.barberId,
          paymentMethod: data.paymentMethod,
          total: total,
          notes: data.notes,
          items: {
            create: itemsWithSubtotal.map((item) => ({
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
        include: { items: true },
      });

      // 5. Baixa estoque dos produtos vendidos
      for (const item of data.items) {
        if (item.type === "PRODUCT" && item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // 6. Lança no financeiro automaticamente (FinancialTransaction)
      // Traduzir paymentMethod de string/PDV para o ENUM PaymentMethod se necessário,
      // ou apenas registrar como INCOME.
      await tx.financialTransaction.create({
        data: {
          type: "INCOME",
          amount: total,
          description: `Venda PDV — ${data.paymentMethod}`,
          category: "PDV",
          date: new Date(),
          saleId: sale.id,
          // Mapeamento simples de método de pagamento (opcional, dependendo do input do PDV)
        },
      });

      return sale;
    });
  }

  async listSales() {
    return saleRepository.findAll();
  }

  async getSale(id: string) {
    const sale = await saleRepository.findById(id);
    if (!sale) throw new Error("Venda não encontrada");
    return sale;
  }
}
