import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcryptjs";

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

  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      const userExists = await userRepository.findByEmail(email);
      if (userExists) {
        return res.status(400).json({ error: "Este email já está sendo utilizado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userRepository.create({
        name,
        email,
        password: hashedPassword,
        role: role || "BARBER"
      });

      // @ts-ignore - Remover senha do retorno
      delete user.password;

      return res.status(201).json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao criar usuário";
      return res.status(500).json({ error: message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password, role } = req.body;

      const user = await userRepository.findById(id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const data: any = { name, email, role };

      if (password) {
        data.password = await bcrypt.hash(password, 10);
      }

      if (email && email !== user.email) {
        const emailExists = await userRepository.findByEmail(email);
        if (emailExists) {
          return res.status(400).json({ error: "Este email já está sendo utilizado" });
        }
      }

      const updatedUser = await userRepository.update(id, data);

      // @ts-ignore - Remover senha do retorno
      delete updatedUser.password;

      return res.json(updatedUser);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar usuário";
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
