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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const userAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authorization token missing or malformed' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const thisUser = yield prisma.user.findUnique({ where: { id: decoded.id, email: decoded.email } });
        if (!thisUser) {
            res.status(401).json({ error: 'invalid token' });
            return;
        }
        req.user = {
            id: thisUser === null || thisUser === void 0 ? void 0 : thisUser.id,
            email: thisUser === null || thisUser === void 0 ? void 0 : thisUser.email,
            name: thisUser === null || thisUser === void 0 ? void 0 : thisUser.name
        };
        next();
    }
    catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
});
exports.default = userAuthorization;
