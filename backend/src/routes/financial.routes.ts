import { Router } from "express";
import { FinancialController } from "../controllers/financial.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/role.middleware";

const router = Router();
const financialController = new FinancialController();

// Todas as rotas financeiras são exclusivas para ADMIN
router.use(authMiddleware);
router.use(ensureAdmin);

router.get("/", financialController.index);
router.post("/", financialController.store);
router.get("/summary", financialController.summary);
router.get("/reports", financialController.reports);

export { router as financialRoutes };
