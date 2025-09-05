import express from "express";
import { upload, uploadProductImage } from "../controllers/uploadController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();
// Rota de upload de imagens de produtos (protegida por autenticação e permissão de admin)
router.post("/product-image", authenticateToken, isAdmin, upload.single("image"), uploadProductImage);
// Exportar como default para compatibilidade com o código existente
export default router;
//# sourceMappingURL=uploadRoutes.js.map