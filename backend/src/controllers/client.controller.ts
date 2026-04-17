import { Request, Response } from "express";
import { ClientService } from "../services/client.service";

const clientService = new ClientService();

export class ClientController {
  async index(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const clients = await clientService.listAll(search as string);
      return res.json(clients);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro ao listar clientes";
      return res.status(500).json({ error: message });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await clientService.getById(id);
      return res.json(client);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Cliente não encontrado";
      return res.status(404).json({ error: message });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const client = await clientService.create(req.body);
      return res.status(201).json(client);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao criar cliente";
      return res.status(400).json({ error: message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await clientService.update(id, req.body);
      return res.json(client);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar cliente";
      return res.status(400).json({ error: message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await clientService.delete(id);
      return res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao remover cliente";
      return res.status(400).json({ error: message });
    }
  }

  async history(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const history = await clientService.getHistory(id);
      return res.json(history);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao buscar histórico";
      return res.status(400).json({ error: message });
    }
  }
}
