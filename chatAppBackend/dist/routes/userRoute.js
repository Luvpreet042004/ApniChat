"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userContollers_1 = require("../controllers/userContollers");
const userMiddleware_1 = __importDefault(require("../middleware/userMiddleware"));
const router = express_1.default.Router();
router.get('/login', userContollers_1.loginUser);
router.post('/create', userContollers_1.registerUser);
router.put('/update', userMiddleware_1.default, userContollers_1.updateUser);
router.delete('/delete', userMiddleware_1.default, userContollers_1.deleteUser);
exports.default = router;
