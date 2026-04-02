const { HTTP_STATUS, ROLES } = require("../utils/constants");

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: "You don't have permission to access this resource",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
