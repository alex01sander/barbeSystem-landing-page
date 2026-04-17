import { Request, Response } from "express";
import { FinancialService } from "../services/financial.service";
import { TransactionType } from "../utils/types";

const financialService = new FinancialService();

export class FinancialController {
  async index(req: Request, res: Response) {
    try {
      const { dateStart, dateEnd, type } = req.query;
      
      const transactions = await financialService.list({
        dateStart: dateStart as string,
        dateEnd: dateEnd as string,
        type: type as TransactionType
      });

      return res.json(transactions);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao listar transações";
      return res.status(500).json({ error: message });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const transaction = await financialService.create(req.body);
      return res.status(201).json(transaction);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao registrar transação";
      return res.status(400).json({ error: message });
    }
  }

  async summary(req: Request, res: Response) {
    try {
      const { dateStart, dateEnd } = req.query;

      if (!dateStart || !dateEnd) {
        return res.status(400).json({ error: "Data inicial e final são obrigatórias" });
      }

      const summary = await financialService.getSummary(dateStart as string, dateEnd as string);
      return res.json(summary);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao gerar resumo";
      return res.status(500).json({ error: message });
    }
  }

  async reports(req: Request, res: Response) {
    try {
      const { dateStart, dateEnd } = req.query;

      if (!dateStart || !dateEnd) {
        return res.status(400).json({ error: "Data inicial e final são obrigatórias" });
      }

      const reports = await financialService.getReports(dateStart as string, dateEnd as string);
      return res.json(reports);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao gerar relatório";
      return res.status(500).json({ error: message });
    }
  }
}
