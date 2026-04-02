const Transaction = require("../models/Transaction");
const { HTTP_STATUS } = require("../utils/constants");

class TransactionService {
  async createTransaction(amount, type, category, date, note, userId) {
    try {
      const transaction = new Transaction({
        amount,
        type,
        category,
        date,
        note,
        createdBy: userId,
      });

      await transaction.save();
      await transaction.populate("createdBy", "-password");

      return {
        success: true,
        message: "Transaction created successfully",
        transaction,
      };
    } catch (error) {
      throw error;
    }
  }

  async getTransactionsByUser(userId, filters = {}) {
    try {
      let query = { createdBy: userId };

      // Apply filters
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.category) {
        query.category = new RegExp(filters.category, "i");
      }
      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) {
          query.date.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.date.$lte = new Date(filters.endDate);
        }
      }

      // Pagination
      const skip = parseInt(filters.skip || 0);
      const limit = parseInt(filters.limit || 10);

      // Get total count for pagination
      const total = await Transaction.countDocuments(query);

      const transactions = await Transaction.find(query)
        .populate("createdBy", "-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return {
        success: true,
        count: transactions.length,
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        limit,
        transactions,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllTransactions(filters = {}) {
    try {
      let query = {};

      // Apply filters
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.category) {
        query.category = new RegExp(filters.category, "i");
      }
      if (filters.createdBy) {
        query.createdBy = filters.createdBy;
      }
      if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) {
          query.date.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.date.$lte = new Date(filters.endDate);
        }
      }

      // Pagination
      const skip = parseInt(filters.skip || 0);
      const limit = parseInt(filters.limit || 10);

      // Get total count for pagination
      const total = await Transaction.countDocuments(query);

      const transactions = await Transaction.find(query)
        .populate("createdBy", "-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return {
        success: true,
        count: transactions.length,
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        limit,
        transactions,
      };
    } catch (error) {
      throw error;
    }
  }

  async getTransactionById(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId).populate(
        "createdBy",
        "-password"
      );

      if (!transaction) {
        const error = new Error("Transaction not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      return {
        success: true,
        transaction,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateTransaction(transactionId, updateData, userId, userRole) {
    try {
      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        const error = new Error("Transaction not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      // Check if user is the creator or is admin
      if (transaction.createdBy.toString() !== userId && userRole !== "ADMIN") {
        const error = new Error("Not authorized to update this transaction");
        error.statusCode = HTTP_STATUS.FORBIDDEN;
        throw error;
      }

      const updatedTransaction = await Transaction.findByIdAndUpdate(
        transactionId,
        updateData,
        { new: true, runValidators: true }
      ).populate("createdBy", "-password");

      return {
        success: true,
        message: "Transaction updated successfully",
        transaction: updatedTransaction,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteTransaction(transactionId, userId, userRole) {
    try {
      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        const error = new Error("Transaction not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      // Check if user is the creator or is admin
      if (transaction.createdBy.toString() !== userId && userRole !== "ADMIN") {
        const error = new Error("Not authorized to delete this transaction");
        error.statusCode = HTTP_STATUS.FORBIDDEN;
        throw error;
      }

      await Transaction.findByIdAndDelete(transactionId);

      return {
        success: true,
        message: "Transaction deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TransactionService();
