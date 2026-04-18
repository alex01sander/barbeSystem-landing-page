import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/role.middleware";

const router = Router();
const serviceController = new ServiceController();

// Rotas públicas (Landing Page)
router.get("/", serviceController.index);
router.get("/:id", serviceController.show);

// Rotas exclusivas de ADMIN (Gerenciar catálogo)
router.post("/", authMiddleware, ensureAdmin, serviceController.store);
router.put("/:id", authMiddleware, ensureAdmin, serviceController.update);
router.delete("/:id", authMiddleware, ensureAdmin, serviceController.delete);

export { router as serviceRoutes };
