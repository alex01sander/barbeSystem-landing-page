import { Request, Response } from "express";
import { BarberRepository } from "../repositories/barber.repository";

const barberRepository = new BarberRepository();

export class BarberController {
  async index(req: Request, res: Response) {
    try {
      const barbers = await barberRepository.findAll();
      return res.json(barbers);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao listar barbeiros";
      return res.status(500).json({ error: message });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const { name, photoUrl, age } = req.body;
      const barber = await barberRepository.create({
        name,
        photoUrl,
        age: age ? parseInt(age) : undefined
      });
      return res.status(201).json(barber);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao criar barbeiro";
      return res.status(500).json({ error: message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, photoUrl, age, isActive } = req.body;
      const barber = await barberRepository.update(id, {
        name,
        photoUrl,
        age: age ? parseInt(age) : undefined,
        isActive
      });
      return res.json(barber);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar barbeiro";
      return res.status(500).json({ error: message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await barberRepository.delete(id);
      return res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao deletar barbeiro";
      return res.status(500).json({ error: message });
    }
  }
}
