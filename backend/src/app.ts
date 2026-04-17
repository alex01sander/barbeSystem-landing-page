import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes";
import { serviceRoutes } from "./routes/service.routes";
import { clientRoutes } from "./routes/client.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/clients", clientRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
