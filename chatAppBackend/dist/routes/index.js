"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./userRoute"));
const router = express_1.default.Router();
// Define your routes here
<<<<<<< HEAD
router.use('/users', userRoute_1.default);
=======
router.use('/user', userRoute_1.default);
>>>>>>> 0c51cc92771aceba8e6df1da9fa2d6f823e085d7
exports.default = router;
