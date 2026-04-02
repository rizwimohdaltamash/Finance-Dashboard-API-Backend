const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validationMiddleware = require("../middleware/validation.middleware");
const { userValidationRules } = require("../utils/validation.rules");
const { ROLES } = require("../utils/constants");

router.use(authMiddleware);

router.get("/", roleMiddleware([ROLES.ADMIN]), userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);

router.patch(
  "/:id/role",
  roleMiddleware([ROLES.ADMIN]),
  userValidationRules().updateRole,
  validationMiddleware,
  userController.updateUserRole
);

router.patch(
  "/:id/status",
  roleMiddleware([ROLES.ADMIN]),
  userValidationRules().updateStatus,
  validationMiddleware,
  userController.updateUserStatus
);

router.delete(
  "/:id",
  roleMiddleware([ROLES.ADMIN]),
  userController.deleteUser
);

module.exports = router;
