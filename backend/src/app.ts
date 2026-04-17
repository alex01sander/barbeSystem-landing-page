import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes";
import { serviceRoutes } from "./routes/service.routes";
import { clientRoutes } from "./routes/client.routes";
import { appointmentRoutes } from "./routes/appointment.routes";
import { financialRoutes } from "./routes/financial.routes";
import { userRoutes } from "./routes/user.routes";
import { barberRoutes } from "./routes/barber.routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/clients", clientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/financial", financialRoutes);
app.use("/users", userRoutes);
app.use("/barbers", barberRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
