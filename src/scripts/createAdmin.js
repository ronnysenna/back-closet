"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Script para criar um usuário administrador
 *
 * Execute com: npm run create:admin -- nome@email.com senha123 "Nome do Administrador"
 */
var client_1 = require("@prisma/client");
var bcrypt_1 = require("bcrypt");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var prisma = new client_1.PrismaClient();
function createAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var args, email, password, name, existingUser, hashedPassword, user, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = process.argv.slice(2);
                    if (args.length < 2) {
                        console.error('Uso: npm run create:admin -- email senha "Nome do Admin"');
                        process.exit(1);
                    }
                    email = args[0];
                    password = args[1];
                    name = args[2] || "Administrador";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 8]);
                    return [4 /*yield*/, prisma.user.findUnique({
                            where: { email: email },
                        })];
                case 2:
                    existingUser = _a.sent();
                    if (existingUser) {
                        console.error("Usu\u00E1rio com email ".concat(email, " j\u00E1 existe."));
                        process.exit(1);
                    }
                    return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                case 3:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: email,
                                name: name,
                                password: hashedPassword,
                                role: "ADMIN",
                            },
                        })];
                case 4:
                    user = _a.sent();
                    console.log("Administrador criado com sucesso:");
                    console.log("ID: ".concat(user.id));
                    console.log("Nome: ".concat(user.name));
                    console.log("Email: ".concat(user.email));
                    console.log("Fun\u00E7\u00E3o: ".concat(user.role));
                    return [3 /*break*/, 8];
                case 5:
                    error_1 = _a.sent();
                    console.error("Erro ao criar usuário administrador:", error_1);
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, prisma.$disconnect()];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
createAdmin();
