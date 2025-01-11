import express, { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // Allow your frontend domain
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());

// Log requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", routes);

// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  // Join rooms for direct messaging
  socket.on("inchat", (sid:number , rid:number) => {
    socket.join(`chat_${Math.min(sid, rid)}_${Math.max(sid, rid)}`);
    console.log(`User ${sid} joined their room chat_${Math.min(sid, rid)}_${Math.max(sid, rid)}`);
  });

  socket.on("updateConnection", (userId) => {
    // Emit an event to the client
    io.emit(`connectionsUpdated:${userId}`);
})

  // Listen for new messages
  socket.on("sendMessage", async (message: { senderId: string; receiverId: string; content: string }) => {
    const { senderId, receiverId, content } = message;

    try {
      // Save message to database
      await prisma.directMessage.create({
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
      } else {
        console.log(`Receiver ${receiverId} is not connected`);
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Graceful Shutdown for Prisma and HTTP Server
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server has been shut down.");
    process.exit(0);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.CLIENT_URL) {
    console.warn("CLIENT_URL is not defined in the environment variables");
  }
});
