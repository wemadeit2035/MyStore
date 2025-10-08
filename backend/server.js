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
// SECURITY MIDDLEWARE
// ========================

import helmet from "helmet";
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
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
          "https://mystore-drab.vercel.app",
          "https://mystore-admin-seven.vercel.app",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        frameSrc: ["'self'", "https://accounts.google.com"],
        baseUri: ["'self'"],
      },
    },
  })
);

// ========================
// MOBILE-OPTIMIZED CORS CONFIGURATION
// ========================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4000",
  "http://localhost:8080",
  "https://mystore-drab.vercel.app",
  "https://mystore-admin-seven.vercel.app",
  // Mobile-specific origins
  "capacitor://localhost",
  "ionic://localhost",
  "http://localhost",
  // Allow all Vercel deployments
  /\.vercel\.app$/,
  /\.vercel\.app$/,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Check against allowed origins
      const isAllowed = allowedOrigins.some((allowed) => {
        if (typeof allowed === "string") {
          return allowed === origin;
        } else if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("🚫 CORS blocked origin:", origin);
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
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
      "x-client-type",
      "user-agent",
    ],
    exposedHeaders: ["Set-Cookie", "token", "Authorization"],
    maxAge: 86400, // 24 hours
  })
);

// Handle preflight requests
app.options("*", cors());

// ========================
// PERFORMANCE & PARSING
// ========================

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ========================
// MOBILE DETECTION MIDDLEWARE
// ========================

import { detectMobile } from "./middleware/mobileDetect.js";
app.use(detectMobile);

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
// FIXED MOBILE PRODUCTS ENDPOINT
// ========================

app.get("/api/mobile/products", async (req, res) => {
  try {
    console.log("📱 Mobile products request from:", req.clientType);

    // Import productModel dynamically to avoid reference errors
    const productModel = (await import("./models/productModel.js")).default;

    const products = await productModel.find({}).sort({ _id: -1 });

    // Mobile-optimized response
    const mobileProducts = products.map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image?.[0] || "",
      category: product.category,
      bestseller: product.bestseller || false,
      inStock: product.inStock !== undefined ? product.inStock : true,
      sizes: product.sizes || [],
    }));

    res.json({
      success: true,
      products: mobileProducts,
      mobile: true,
      client: req.clientType,
      count: products.length,
      message: "Mobile-optimized products",
    });
  } catch (error) {
    console.error("❌ Mobile products error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching mobile products: " + error.message,
      mobile: true,
      client: req.clientType,
    });
  }
});

// ========================
// MOBILE HEALTH CHECK ENDPOINT
// ========================

app.get("/api/mobile/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "OK",
      timestamp: new Date().toISOString(),
      client: req.clientType,
      mobile: req.isMobile,
      environment: config.nodeEnv,
    },
  });
});

// ========================
// EXISTING HEALTH & STATUS
// ========================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      client: req.clientType,
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
      mobileSupport: true,
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
      client: req.clientType,
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      error: {
        message: "CORS Error: Origin not allowed",
        origin: req.get("origin"),
        client: req.clientType,
      },
    });
  }

  res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
      ...(config.nodeEnv === "development" && { stack: err.stack }),
      client: req.clientType,
    },
  });
});

// ========================
// ADD API ROOT ENDPOINT
// ========================

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "API Root - Available Endpoints",
    endpoints: {
      products: "/api/product/list",
      users: "/api/user",
      cart: "/api/cart",
      orders: "/api/order",
      health: "/api/mobile/health",
    },
    mobile: req.isMobile,
    client: req.clientType,
  });
});

// ========================
// START SERVER
// ========================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`📱 Mobile support enabled`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(", ")}`);
});

export default app;
