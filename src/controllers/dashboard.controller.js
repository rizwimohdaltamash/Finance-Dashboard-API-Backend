const dashboardService = require("../services/dashboard.service");
const { HTTP_STATUS } = require("../utils/constants");

const resolveTargetUserId = (req) => {
  if (req.user?.role === "ADMIN" && req.query.userId) {
    return req.query.userId;
  }
  return req.user.id;
};

exports.getSummary = async (req, res, next) => {
  try {
    const userId = resolveTargetUserId(req);
    const result = await dashboardService.getSummary(userId);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    const userId = resolveTargetUserId(req);
    const result = await dashboardService.getCategoryBreakdown(userId);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyTrends = async (req, res, next) => {
  try {
    const userId = resolveTargetUserId(req);
    const result = await dashboardService.getMonthlyTrends(userId);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getRecentTransactions = async (req, res, next) => {
  try {
    const userId = resolveTargetUserId(req);
    const limit = parseInt(req.query.limit) || 10;
    const result = await dashboardService.getRecentTransactions(userId, limit);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getAdminSummary = async (req, res, next) => {
  try {
    const result = await dashboardService.getAdminSummary();
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getAdminCategoryBreakdown = async (req, res, next) => {
  try {
    const result = await dashboardService.getAdminCategoryBreakdown();
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};
