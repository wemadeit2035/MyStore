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

connectDB();
connectCloudinary();

const BESTSELLER_UPDATE_INTERVAL = 24 * 60 * 60 * 1000;
setInterval(async () => {
  try {
    await updateBestsellerStatus();
  } catch (error) {
    // Silent error handling
  }
}, BESTSELLER_UPDATE_INTERVAL);

updateBestsellerStatus();

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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4000",
  "http://localhost:8080",
  "https://mystore-drab.vercel.app",
  "https://mystore-admin-seven.vercel.app",
  "capacitor://localhost",
  "ionic://localhost",
  "http://localhost",
  /\.vercel\.app$/,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

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
    maxAge: 86400,
  })
);

app.options("*", cors());

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

import { detectMobile } from "./middleware/mobileDetect.js";
app.use(detectMobile);

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

app.use((err, req, res, next) => {
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

export default app;
