const { body } = require("express-validator");

const authValidationRules = () => {
  return {
    register: [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters"),
      body("email")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    ],
    login: [
      body("email")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),
      body("password")
        .notEmpty()
        .withMessage("Password is required"),
    ],
  };
};

const transactionValidationRules = () => {
  return {
    create: [
      body("amount")
        .isFloat({ min: 0 })
        .withMessage("Amount must be a positive number"),
      body("type")
        .isIn(["income", "expense"])
        .withMessage("Type must be 'income' or 'expense'"),
      body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),
      body("date")
        .isISO8601()
        .withMessage("Invalid date format"),
      body("note")
        .optional()
        .trim(),
    ],
    update: [
      body("amount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Amount must be a positive number"),
      body("type")
        .optional()
        .isIn(["income", "expense"])
        .withMessage("Type must be 'income' or 'expense'"),
      body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category cannot be empty"),
      body("date")
        .optional()
        .isISO8601()
        .withMessage("Invalid date format"),
      body("note")
        .optional()
        .trim(),
    ],
  };
};

const userValidationRules = () => {
  return {
    updateRole: [
      body("role")
        .isIn(["ADMIN", "ANALYST", "VIEWER"])
        .withMessage("Invalid role"),
    ],
    updateStatus: [
      body("status")
        .isIn(["ACTIVE", "INACTIVE"])
        .withMessage("Invalid status"),
    ],
  };
};

module.exports = {
  authValidationRules,
  transactionValidationRules,
  userValidationRules,
};
