import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { initDB } from "./config/database.js";

// Import routes
import chatRoutes from "./routes/chatRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Initialize database
initDB();

// ✅ Secure & Flexible CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // local frontend (Vite)
  "http://localhost:3001", // another possible dev port
  "https://samraai.vercel.app", // example production domain
  "https://yourfrontend.com" // replace with your actual domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("🚫 CORS blocked request from:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if using cookies/auth tokens
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/chat", chatRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SamraAI Backend is running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ SamraAI Backend running at http://localhost:${PORT}`);
});
