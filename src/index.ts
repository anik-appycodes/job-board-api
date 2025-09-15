import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
