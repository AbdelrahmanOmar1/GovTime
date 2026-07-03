// app.js
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const chalk = require("chalk");

require("dotenv").config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET_KEY"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  throw new Error(
    `Missing required environment variables: ${missingEnv.join(", ")}`,
  );
}

require("./config/db");

const UserRouter = require("./routes/userRouter");
const AuthRouter = require("./routes/authRouter");
const appointmetnsRouter = require("./routes/appointments");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorHandler");
const notificationRouter = require("./routes/notificationRouter");
const app = express();

// ============================
// MIDDLEWARES
// ============================

// Security headers
app.use(helmet());

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "https://gov-time-6bcnjqw3f-abdelrahamn1s-projects.vercel.app",
  "https://gov-time-6bcnjqw3f-abdelrahamn1s-projects.vercel.app:443",
];

const allowedOrigins = [
  ...defaultAllowedOrigins,
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
    : []),
  ...(process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(",").map((url) => url.trim())
    : []),
].filter(Boolean);

console.log("CORS allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("CORS reject origin:", origin);
        callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
      }
    },
    credentials: true,
  }),
);

// Body parser
app.use(express.json());
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === "development") {
  console.log(chalk.green("🚀 Server is running in development mode..."));
  app.use(morgan("dev"));
} else if (process.env.NODE_ENV === "production") {
  console.log(chalk.blue("🚀 Server is running in production mode..."));
  app.use(morgan("combined"));
}

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login/signup attempts, please try again later",
});

// app.use('/api', globalLimiter);
// app.use('/api/v1/auth', authLimiter);

// ============================
// ROUTES
// ============================
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/appointments", appointmetnsRouter);
app.use("/api/v1/notifications", notificationRouter);
// ============================
// UNHANDLED ROUTES (404)
// ============================
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ============================
// GLOBAL ERROR HANDLER
// ============================
app.use(globalErrorHandler);

module.exports = app;
