import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ensureAdmin } from "../middlewares/role.middleware";

const router = Router();
const productController = new ProductController();

router.get("/", authMiddleware, productController.list);
router.post("/", authMiddleware, ensureAdmin, productController.create);
router.put("/:id", authMiddleware, ensureAdmin, productController.update);
router.delete("/:id", authMiddleware, ensureAdmin, productController.remove);

export { router as productRoutes };
