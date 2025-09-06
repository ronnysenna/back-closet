"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController = require("../controllers/authController.js");
var authMiddleware_js_1 = require("../middleware/authMiddleware.js");
var router = express_1.default.Router();
// Rotas públicas
router.post("/login", authController.login);
// Rotas protegidas
router.get("/verify", authMiddleware_js_1.authenticateToken, authController.verifyToken);
// Rotas de administrador
router.post("/register", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, authController.register);
exports.default = router;
