import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes";
import { serviceRoutes } from "./routes/service.routes";
import { clientRoutes } from "./routes/client.routes";
import { appointmentRoutes } from "./routes/appointment.routes";
import { financialRoutes } from "./routes/financial.routes";
import { userRoutes } from "./routes/user.routes";
import { barberRoutes } from "./routes/barber.routes";
import { productRoutes } from "./routes/product.routes";
import { saleRoutes } from "./routes/sale.routes";

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/clients", clientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/financial", financialRoutes);
app.use("/users", userRoutes);
app.use("/barbers", barberRoutes);
app.use("/products", productRoutes);
app.use("/sales", saleRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
