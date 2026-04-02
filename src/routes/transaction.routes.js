const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validationMiddleware = require("../middleware/validation.middleware");
const { transactionValidationRules } = require("../utils/validation.rules");
const { ROLES } = require("../utils/constants");

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]),
  transactionValidationRules().create,
  validationMiddleware,
  transactionController.createTransaction
);

router.get("/user/my-transactions", transactionController.getTransactionsByUser);

router.get(
  "/all",
  roleMiddleware([ROLES.ADMIN]),
  transactionController.getAllTransactions
);

router.get("/:id", transactionController.getTransactionById);

router.patch(
  "/:id",
  roleMiddleware([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]),
  transactionValidationRules().update,
  validationMiddleware,
  transactionController.updateTransaction
);

router.delete(
  "/:id",
  roleMiddleware([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]),
  transactionController.deleteTransaction
);

module.exports = router;
