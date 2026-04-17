import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
  name: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authorization.split(" ");

  try {
    const secret = process.env.JWT_SECRET || "default-secret";
    const decoded = jwt.verify(token, secret) as TokenPayload;

    // Attach user data to request
    (req as any).user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
