const authService = require("../services/auth.service");
const { HTTP_STATUS, ROLES } = require("../utils/constants");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    if (role && !Object.values(ROLES).includes(role)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    const result = await authService.register(name, email, password, role);

    res.status(HTTP_STATUS.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const result = await authService.login(email, password);

    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await authService.getCurrentUser(userId);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};
