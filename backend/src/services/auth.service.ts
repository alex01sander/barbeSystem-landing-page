import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { LoginDTO } from "../utils/types"; // I'll create this or use a simple type

const userRepository = new UserRepository();

export class AuthService {
  async login({ email, password }: LoginDTO) {
    // 1. Verificar se usuário existe
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    // 3. Comparar senhas
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Credenciais inválidas");
    }

    // 4. Gerar Token
    const secret = process.env.JWT_SECRET || "default-secret";
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        name: user.name 
      },
      secret,
      { expiresIn: "24h" }
    );

    // 5. Retornar dados (sem senha)
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
