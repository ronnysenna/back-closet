// Configuração CORS com proxy reverso para o frontend
import cors from "cors";

// Configuração do CORS para permitir acesso do frontend
const corsOptions = {
	origin: ["http://localhost:5173", "http://localhost:3000"],
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

export const corsMiddleware = cors(corsOptions);
