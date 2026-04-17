import { Router } from "express";
import { ClientController } from "../controllers/client.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const clientController = new ClientController();

// Todas as rotas de clientes requerem autenticação
router.use(authMiddleware);

router.get("/", clientController.index);
router.get("/:id", clientController.show);
router.get("/:id/history", clientController.history);
router.post("/", clientController.store);
router.put("/:id", clientController.update);
router.delete("/:id", clientController.delete);

export { router as clientRoutes };
