import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();

export class UserController {
  async index(req: Request, res: Response) {
    try {
      const { role } = req.query;
      const users = await userRepository.findAll(role as any);
      return res.json(users);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao listar usuários";
      return res.status(500).json({ error: message });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userRepository.findById(id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      return res.json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao buscar usuário";
      return res.status(500).json({ error: message });
    }
  }
}
