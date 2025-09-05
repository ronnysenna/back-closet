import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Configuração de ambiente
dotenv.config();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Inicialização do Express
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Reabilitamos o middleware de limitação de taxa após correção
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";
app.use("/api", apiLimiter);

// Importar middleware de logging avançado
import { httpLogger } from "./middleware/loggingMiddleware.js";
import Logger from "./utils/logger.js";

// Middleware para logging avançado
app.use(httpLogger);

// Log de inicialização do servidor
Logger.info("Servidor inicializado");

// Configurar Swagger para documentação da API
import { setupSwagger } from "./utils/swagger.js";
setupSwagger(app);

// Rotas
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Servir arquivos estáticos da pasta public
app.use(express.static("public"));

// Rota para verificação de status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Importar middlewares de tratamento de erros
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

// Middleware para tratamento de rotas não encontradas - deve vir após todas as rotas
app.use(notFoundHandler);

// Middleware para tratamento de erros - deve ser o último middleware
app.use(errorHandler);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Tratamento de erros não capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

export default app;
