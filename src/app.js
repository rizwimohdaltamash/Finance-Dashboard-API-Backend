const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const errorMiddleware = require("./middleware/error.middleware");

// Import Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Status
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Swagger Docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Finance Dashboard API Docs",
  customCss: `.swagger-ui .topbar { background-color: #1a1a2e; } .swagger-ui .topbar-wrapper img { content: none; } .swagger-ui .topbar-wrapper::before { content: '💰 Finance Dashboard API'; color: white; font-size: 1.2rem; font-weight: bold; }`,
}));

// Root redirect to docs
app.get("/", (req, res) => {
  res.redirect("/docs");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Middleware (must be last)
app.use(errorMiddleware);

module.exports = app;
