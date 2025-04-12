import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

// Initialize Express app

const PORT = process.env.PORT || 5001; // Default to 5001 if PORT is undefined
const __dirname = path.resolve();

// Connect to Database before starting the server
connectDB();

// Middleware Configuration
app.use(express.json({ limit: "50mb" })); // Prevent PayloadTooLargeError
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production")
{
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // when system go under production

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});
