import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      const result = await authService.login({ email, password });

      return res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado";
      return res.status(401).json({ error: message });
    }
  }
}
