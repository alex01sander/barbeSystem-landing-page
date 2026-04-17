import { Router } from "express";
import { AppointmentController } from "../controllers/appointment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const appointmentController = new AppointmentController();

// Todas as rotas de agendamentos requerem autenticação
router.use(authMiddleware);

router.get("/", appointmentController.index);
router.post("/", appointmentController.store);
router.patch("/:id/status", appointmentController.updateStatus);

export { router as appointmentRoutes };
