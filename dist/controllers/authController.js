import prisma from "../utils/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
// Login de usuário
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email e senha são obrigatórios" });
        }
        // Busca usuário pelo email
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: "Email ou senha incorretos" });
        }
        // Verifica se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou senha incorretos" });
        }
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error("JWT_SECRET não está definido no arquivo .env");
            return res
                .status(500)
                .json({ message: "Erro de configuração no servidor" });
        }
        // Gera o token JWT
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, secretKey, {
            expiresIn: "1d", // Token expira em 1 dia
        });
        // Retorna o token e dados básicos do usuário
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
};
// Registrar um novo usuário (apenas para admins)
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Verifica se já existe um usuário com este email
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Este email já está sendo utilizado" });
        }
        // Hash da senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Cria o novo usuário
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "USER",
            },
        });
        res.status(201).json({
            message: "Usuário criado com sucesso",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
};
// Verificar token atual
export const verifyToken = (req, res) => {
    // Se chegou aqui, o middleware de autenticação já validou o token
    res.json({
        valid: true,
        user: req.user,
    });
};
//# sourceMappingURL=authController.js.map