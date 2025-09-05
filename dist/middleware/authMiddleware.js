import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// Middleware para verificar se o token JWT é válido
export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
        if (!token) {
            return res
                .status(401)
                .json({ message: "Token de autenticação não fornecido" });
        }
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error("JWT_SECRET não está definido no arquivo .env");
            return res
                .status(500)
                .json({ message: "Erro de configuração no servidor" });
        }
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.error("Erro ao verificar token:", err.message);
                return res.status(403).json({ message: "Token inválido ou expirado" });
            }
            // Adiciona os dados do usuário decodificado ao objeto request
            req.user = decoded;
            next();
        });
    }
    catch (error) {
        console.error("Erro no middleware de autenticação:", error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
};
// Middleware para verificar se o usuário é administrador
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    if (req.user.role !== "ADMIN") {
        return res
            .status(403)
            .json({
            message: "Acesso não autorizado. Requer privilégios de administrador",
        });
    }
    next();
};
//# sourceMappingURL=authMiddleware.js.map