import { Request, Response } from "express";
import { ServiceService } from "../services/service.service";

const serviceService = new ServiceService();

export class ServiceController {
  async index(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === "true";
      const services = await serviceService.listAll(includeInactive);
      return res.json(services);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado";
      return res.status(500).json({ error: message });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = await serviceService.getById(id);
      return res.json(service);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado";
      return res.status(404).json({ error: message });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const service = await serviceService.create(req.body);
      return res.status(201).json(service);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado";
      return res.status(400).json({ error: message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = await serviceService.update(id, req.body);
      return res.json(service);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado";
      return res.status(400).json({ error: message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await serviceService.delete(id);
      return res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado";
      return res.status(400).json({ error: message });
    }
  }
}
