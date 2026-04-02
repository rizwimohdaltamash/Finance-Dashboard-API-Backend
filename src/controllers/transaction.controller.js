const transactionService = require("../services/transaction.service");
const { HTTP_STATUS } = require("../utils/constants");

exports.createTransaction = async (req, res, next) => {
  try {
    const { amount, type, category, date, note } = req.body;
    const userId = req.user.id;

    if (!amount || !type || !category || !date) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const result = await transactionService.createTransaction(
      amount,
      type,
      category,
      date,
      note,
      userId
    );

    res.status(HTTP_STATUS.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getTransactionsByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const filters = {
      type: req.query.type,
      category: req.query.category,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      skip: req.query.skip,
      limit: req.query.limit,
    };
    const result = await transactionService.getTransactionsByUser(userId, filters);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      category: req.query.category,
      createdBy: req.query.createdBy,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      skip: req.query.skip,
      limit: req.query.limit,
    };
    const result = await transactionService.getAllTransactions(filters);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await transactionService.getTransactionById(id);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const result = await transactionService.updateTransaction(
      id,
      req.body,
      userId,
      userRole
    );
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const result = await transactionService.deleteTransaction(id, userId, userRole);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};
