const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validationMiddleware = require("../middleware/validation.middleware");
const { authValidationRules } = require("../utils/validation.rules");

router.post(
  "/register",
  authValidationRules().register,
  validationMiddleware,
  authController.register
);

router.post(
  "/login",
  authValidationRules().login,
  validationMiddleware,
  authController.login
);

router.get("/me", authMiddleware, authController.getCurrentUser);

module.exports = router;
