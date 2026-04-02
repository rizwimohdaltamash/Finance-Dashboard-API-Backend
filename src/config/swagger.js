const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Dashboard API",
      version: "1.0.0",
      description:
        "REST API for the Finance Dashboard — manage users, transactions, and analytics.",
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production"
          ? "https://finance-dashboard-api-backend-2.onrender.com"
          : `http://localhost:${process.env.PORT || 5000}`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production Server"
            : "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from /api/auth/login",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", enum: ["admin", "analyst", "viewer"], example: "viewer" },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            userId: { type: "string", example: "64abc123def456" },
            type: { type: "string", enum: ["income", "expense"], example: "expense" },
            amount: { type: "number", example: 250.5 },
            category: { type: "string", example: "Food" },
            description: { type: "string", example: "Grocery shopping" },
            date: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "An error occurred" },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User management endpoints (requires auth)" },
      { name: "Transactions", description: "Transaction CRUD endpoints (requires auth)" },
      { name: "Dashboard", description: "Analytics & summary endpoints (requires auth)" },
    ],
    paths: {
      // ─── AUTH ────────────────────────────────────────────────────────────────
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string", example: "John Doe" },
                    email: { type: "string", example: "john@example.com" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      token: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login and receive JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "john@example.com" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      token: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current logged-in user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Current user data",
              content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
            },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },

      // ─── USERS ───────────────────────────────────────────────────────────────
      "/api/users": {
        get: {
          tags: ["Users"],
          summary: "Get all users (Admin only)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "List of users",
              content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } },
            },
            403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "User found", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
            404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update user by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "User updated", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete user by ID (Admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "User deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
            403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/users/{id}/role": {
        patch: {
          tags: ["Users"],
          summary: "Update user role (Admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["role"],
                  properties: { role: { type: "string", enum: ["admin", "analyst", "viewer"] } },
                },
              },
            },
          },
          responses: {
            200: { description: "Role updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
          },
        },
      },
      "/api/users/{id}/status": {
        patch: {
          tags: ["Users"],
          summary: "Update user active status (Admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["isActive"],
                  properties: { isActive: { type: "boolean" } },
                },
              },
            },
          },
          responses: {
            200: { description: "Status updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
          },
        },
      },

      // ─── TRANSACTIONS ─────────────────────────────────────────────────────────
      "/api/transactions": {
        post: {
          tags: ["Transactions"],
          summary: "Create a new transaction",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["type", "amount", "category"],
                  properties: {
                    type: { type: "string", enum: ["income", "expense"] },
                    amount: { type: "number", example: 150.0 },
                    category: { type: "string", example: "Food" },
                    description: { type: "string", example: "Dinner" },
                    date: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Transaction created", content: { "application/json": { schema: { $ref: "#/components/schemas/Transaction" } } } },
            400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/transactions/user/my-transactions": {
        get: {
          tags: ["Transactions"],
          summary: "Get all transactions for the logged-in user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "User transactions",
              content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Transaction" } } } },
            },
          },
        },
      },
      "/api/transactions/all": {
        get: {
          tags: ["Transactions"],
          summary: "Get all transactions (Admin only)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "All transactions",
              content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Transaction" } } } },
            },
            403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/transactions/{id}": {
        get: {
          tags: ["Transactions"],
          summary: "Get transaction by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Transaction found", content: { "application/json": { schema: { $ref: "#/components/schemas/Transaction" } } } },
            404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
        patch: {
          tags: ["Transactions"],
          summary: "Update transaction by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    amount: { type: "number" },
                    category: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Transaction updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Transaction" } } } },
          },
        },
        delete: {
          tags: ["Transactions"],
          summary: "Delete transaction by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Transaction deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
          },
        },
      },

      // ─── DASHBOARD ────────────────────────────────────────────────────────────
      "/api/dashboard/summary": {
        get: {
          tags: ["Dashboard"],
          summary: "Get financial summary (Analyst & Admin)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Summary data", content: { "application/json": { schema: { type: "object" } } } },
            403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/dashboard/category-breakdown": {
        get: {
          tags: ["Dashboard"],
          summary: "Get spending by category (Analyst & Admin)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Category breakdown", content: { "application/json": { schema: { type: "object" } } } },
          },
        },
      },
      "/api/dashboard/monthly-trends": {
        get: {
          tags: ["Dashboard"],
          summary: "Get monthly income/expense trends (Analyst & Admin)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Monthly trends data", content: { "application/json": { schema: { type: "object" } } } },
          },
        },
      },
      "/api/dashboard/recent-transactions": {
        get: {
          tags: ["Dashboard"],
          summary: "Get recent transactions (Analyst & Admin)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Recent transactions list", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Transaction" } } } } },
          },
        },
      },
      "/api/dashboard/admin/summary": {
        get: {
          tags: ["Dashboard"],
          summary: "Get admin-level global summary (Admin only)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Admin summary data", content: { "application/json": { schema: { type: "object" } } } },
            403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/dashboard/admin/category-breakdown": {
        get: {
          tags: ["Dashboard"],
          summary: "Get global category breakdown (Admin only)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Admin category breakdown", content: { "application/json": { schema: { type: "object" } } } },
            403: { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
