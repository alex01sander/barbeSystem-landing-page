import { Router } from "express";
import { SaleController } from "../controllers/sale.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const saleController = new SaleController();

router.post("/", authMiddleware, saleController.create);
router.get("/", authMiddleware, saleController.list);
router.get("/:id", authMiddleware, saleController.getById);

export { router as saleRoutes };
