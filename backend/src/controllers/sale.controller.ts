import { Request, Response } from "express";
import { SaleService } from "../services/sale.service";

const saleService = new SaleService();

export class SaleController {
  async create(req: Request, res: Response) {
    try {
      const sale = await saleService.createSale(req.body);
      return res.status(201).json(sale);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao processar venda";
      return res.status(400).json({ error: message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const sales = await saleService.listSales();
      return res.json(sales);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao listar vendas";
      return res.status(500).json({ error: message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sale = await saleService.getSale(id);
      return res.json(sale);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Venda não encontrada";
      return res.status(404).json({ error: message });
    }
  }
}
