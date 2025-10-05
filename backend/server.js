import "./config/index.js";
import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import config from "./config/index.js";
import { updateBestsellerStatus } from "./controllers/productController.js";

const app = express();
const PORT = config.port;

// Initialize services
connectDB();
connectCloudinary();

// Auto-update bestseller status every 24 hours
const BESTSELLER_UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

setInterval(async () => {
  try {
    await updateBestsellerStatus();
  } catch (error) {
    // Silent error handling for scheduled task
  }
}, BESTSELLER_UPDATE_INTERVAL);

// Also run once on server start
updateBestsellerStatus();

// ========================
// SECURITY MIDDLEWARE (Express 5 Compatible)
// ========================

import helmet from "helmet";
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: [
          "'self'",
          "https://accounts.google.com",
          "https://oauth2.googleapis.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        frameSrc: ["'self'", "https://accounts.google.com"],
        baseUri: ["'self'"],
      },
    },
  })
);

// ========================
// CORS
// ========================

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4000",
        "https://mystore-drab.vercel.app",
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
      ].filter(Boolean);

      console.log("CORS Origin Check:", { origin, allowedOrigins }); // Debug log

      // Allow requests with no origin (like mobile apps) or from allowed origins
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.includes("localhost") ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("CORS Blocked:", origin); // Debug log
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
      "token",
      "x-auth-token",
      "accept",
      "origin",
      "x-requested-with",
    ],
    exposedHeaders: ["Set-Cookie", "token"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Add this after CORS to handle preflight requests
app.options("*", cors());

// ========================
// PERFORMANCE & PARSING
// ========================

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ========================
// CUSTOM SECURITY MIDDLEWARE
// ========================

// Simple NoSQL injection protection
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        if (key.startsWith("$")) {
          delete obj[key];
        } else if (typeof obj[key] === "object") {
          sanitize(obj[key]);
        }
      });
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  next();
});

// ========================
// ROUTES
// ========================

// Import routes using dynamic imports (ESM compatible)
const userRouter = (await import("./routes/userRoute.js")).default;
const productRouter = (await import("./routes/productRoute.js")).default;
const cartRouter = (await import("./routes/cartRoute.js")).default;
const orderRouter = (await import("./routes/orderRoute.js")).default;
const newsletterRouter = (await import("./routes/newsletterRoute.js")).default;
const analyticsRouter = (await import("./routes/analyticsRouter.js")).default;

app.use("/api/user", userRouter);
app.use("/api/profile", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/analytics", analyticsRouter);

// ========================
// HEALTH & STATUS
// ========================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
    },
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      message: "E-commerce API Service",
      version: "1.0.0",
      environment: config.nodeEnv,
    },
  });
});

// ========================
// ERROR HANDLING
// ========================

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
      path: req.originalUrl,
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
      ...(config.isDevelopment && { stack: err.stack }),
    },
  });
});

// ========================
// START SERVER
// ========================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

export default app;
