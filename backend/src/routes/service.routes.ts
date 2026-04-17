import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/role.middleware";

const router = Router();
const serviceController = new ServiceController();

// Rotas públicas ou autenticadas (Barbeiros e Clientes podem ver)
router.get("/", authMiddleware, serviceController.index);
router.get("/:id", authMiddleware, serviceController.show);

// Rotas exclusivas de ADMIN (Gerenciar catálogo)
router.post("/", authMiddleware, ensureAdmin, serviceController.store);
router.put("/:id", authMiddleware, ensureAdmin, serviceController.update);
router.delete("/:id", authMiddleware, ensureAdmin, serviceController.delete);

export { router as serviceRoutes };
