import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/connect-db";
import employeeRoutes from "./routes/employeeRoutes";
import authRoutes from "./routes/authRoutes";
import { seedEmployees } from "./seed/employeeSeed";
import path from "path";
import attendanceRoutes from "./routes/attendanceRoutes";
import taskRoutes from "./routes/taskRoutes";
import aiRoutes from "./routes/aiRoutes";

dotenv.config();


const app: Express = express();

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : [];

const allowedOrigins = [
  "http://localhost:5173",
  "https://employee-management-system-38r2.vercel.app",
  "https://employee-management-system-woad-alpha.vercel.app",
  "https://employee-management-nkcosj1le-geeta-chahars-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin denied: ${origin}`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);

app.get("/health", (req: Request, res: Response): void => {
  res.status(200).json({ message: "Server is running" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: "Route not found" });
});

const PORT: number | string = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await seedEmployees();
    app.listen(PORT, (): void => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to start server:", errorMessage);
    process.exit(1);
  }
};

startServer().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("Unexpected error:", errorMessage);
  process.exit(1);
});

export default app;
