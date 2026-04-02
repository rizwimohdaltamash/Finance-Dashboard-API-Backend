const Transaction = require("../models/Transaction");
const User = require("../models/User");
const mongoose = require("mongoose");

class DashboardService {
  // Get summary stats using aggregation
  async getSummary(userId) {
    try {
      const summary = await Transaction.aggregate([
        {
          $match: {
            createdBy: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 1,
            total: 1,
            count: 1,
          },
        },
      ]);

      let totalIncome = 0;
      let totalExpense = 0;
      let incomeCount = 0;
      let expenseCount = 0;

      summary.forEach((item) => {
        if (item._id === "income") {
          totalIncome = item.total;
          incomeCount = item.count;
        } else if (item._id === "expense") {
          totalExpense = item.total;
          expenseCount = item.count;
        }
      });

      const netBalance = totalIncome - totalExpense;

      return {
        success: true,
        summary: {
          totalIncome,
          totalExpense,
          netBalance,
          totalTransactions: incomeCount + expenseCount,
          incomeCount,
          expenseCount,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get category breakdown using aggregation
  async getCategoryBreakdown(userId) {
    try {
      const breakdown = await Transaction.aggregate([
        {
          $match: {
            createdBy: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
            type: { $first: "$type" },
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            totalAmount: 1,
            count: 1,
            type: 1,
          },
        },
      ]);

      return {
        success: true,
        categoryBreakdown: breakdown,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get monthly trends using aggregation
  async getMonthlyTrends(userId) {
    try {
      const trends = await Transaction.aggregate([
        {
          $match: {
            createdBy: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              type: "$type",
            },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            type: "$_id.type",
            total: 1,
            count: 1,
          },
        },
      ]);

      // Group by month
      const groupedTrends = {};
      trends.forEach((item) => {
        const key = `${item.year}-${String(item.month).padStart(2, "0")}`;
        if (!groupedTrends[key]) {
          groupedTrends[key] = {
            month: key,
            income: 0,
            expense: 0,
            netAmount: 0,
          };
        }
        if (item.type === "income") {
          groupedTrends[key].income += item.total;
        } else {
          groupedTrends[key].expense += item.total;
        }
        groupedTrends[key].netAmount = groupedTrends[key].income - groupedTrends[key].expense;
      });

      return {
        success: true,
        monthlyTrends: Object.values(groupedTrends),
      };
    } catch (error) {
      throw error;
    }
  }

  // Get recent transactions
  async getRecentTransactions(userId, limit = 10) {
    try {
      const recent = await Transaction.find({ createdBy: userId })
        .populate("createdBy", "-password")
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        recentTransactions: recent,
      };
    } catch (error) {
      throw error;
    }
  }

  // Admin dashboard - all transactions summary
  async getAdminSummary() {
    try {
      const summary = await Transaction.aggregate([
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      const totalUsers = await User.countDocuments();
      const totalTransactions = await Transaction.countDocuments();

      let totalIncome = 0;
      let totalExpense = 0;

      summary.forEach((item) => {
        if (item._id === "income") {
          totalIncome = item.total;
        } else if (item._id === "expense") {
          totalExpense = item.total;
        }
      });

      const netBalance = totalIncome - totalExpense;

      return {
        success: true,
        summary: {
          totalUsers,
          totalTransactions,
          totalIncome,
          totalExpense,
          netBalance,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Admin category breakdown - across all users
  async getAdminCategoryBreakdown() {
    try {
      const breakdown = await Transaction.aggregate([
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
            type: { $first: "$type" },
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            totalAmount: 1,
            count: 1,
            type: 1,
          },
        },
      ]);

      return {
        success: true,
        categoryBreakdown: breakdown,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DashboardService();
