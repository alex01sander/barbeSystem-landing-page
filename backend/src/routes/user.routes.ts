import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

// Todas as rotas de usuários requerem autenticação
router.use(authMiddleware);

router.get("/", userController.index);
router.get("/:id", userController.show);

export { router as userRoutes };
