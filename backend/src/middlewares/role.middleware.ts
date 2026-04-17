import { Request, Response, NextFunction } from "express";

export const ensureAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (user.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores podem realizar esta ação." });
  }

  return next();
};
