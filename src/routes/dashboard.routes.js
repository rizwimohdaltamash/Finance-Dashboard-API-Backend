const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const { ROLES } = require("../utils/constants");

router.use(authMiddleware);

// User dashboard routes (Analyst & Admin only)
router.get(
  "/summary",
  roleMiddleware([ROLES.ANALYST, ROLES.ADMIN]),
  dashboardController.getSummary
);

router.get(
  "/category-breakdown",
  roleMiddleware([ROLES.ANALYST, ROLES.ADMIN]),
  dashboardController.getCategoryBreakdown
);

router.get(
  "/monthly-trends",
  roleMiddleware([ROLES.ANALYST, ROLES.ADMIN]),
  dashboardController.getMonthlyTrends
);

router.get(
  "/recent-transactions",
  roleMiddleware([ROLES.ANALYST, ROLES.ADMIN]),
  dashboardController.getRecentTransactions
);

// Admin dashboard routes (Admin only)
router.get(
  "/admin/summary",
  roleMiddleware([ROLES.ADMIN]),
  dashboardController.getAdminSummary
);

router.get(
  "/admin/category-breakdown",
  roleMiddleware([ROLES.ADMIN]),
  dashboardController.getAdminCategoryBreakdown
);

module.exports = router;
