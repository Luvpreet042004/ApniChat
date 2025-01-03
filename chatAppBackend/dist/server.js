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
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL, // Allow your frontend domain
        methods: ["GET", "POST"],
    },
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Routes
app.use("/api", index_1.default);
// Socket.IO
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    // Join rooms for direct messaging
    socket.on("inchat", ({ userId }) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });
    // Listen for new messages
    socket.on("sendMessage", (message) => __awaiter(void 0, void 0, void 0, function* () {
        const { senderId, receiverId, content } = message;
        try {
            // Save message to database
            yield prisma.directMessage.create({
                data: {
                    content,
                    senderId: Number(senderId),
                    receiverId: Number(receiverId),
                    status: "sent",
                },
            });
            // Emit message to the receiver
            if (io.sockets.adapter.rooms.has(receiverId)) {
                io.to(receiverId).emit("receiveMessage", message);
            }
            else {
                console.log(`Receiver ${receiverId} is not connected`);
            }
        }
        catch (error) {
            console.error("Error saving message:", error);
        }
    }));
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});
// Graceful Shutdown for Prisma and HTTP Server
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Shutting down...");
    yield prisma.$disconnect();
    server.close(() => {
        console.log("Server has been shut down.");
        process.exit(0);
    });
}));
// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!process.env.CLIENT_URL) {
        console.warn("CLIENT_URL is not defined in the environment variables");
    }
});
