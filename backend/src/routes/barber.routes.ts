import { Router } from "express";
import { BarberController } from "../controllers/barber.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/role.middleware";

const router = Router();
const barberController = new BarberController();

// Listagem é aberta (Pública para a Landing Page)
router.get("/", barberController.index);

// Cadastro, Edição e Exclusão são restritos a ADMIN
router.post("/", authMiddleware, ensureAdmin, barberController.store);
router.put("/:id", authMiddleware, ensureAdmin, barberController.update);
router.delete("/:id", authMiddleware, ensureAdmin, barberController.delete);

export { router as barberRoutes };
