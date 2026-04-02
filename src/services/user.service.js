const User = require("../models/User");
const { HTTP_STATUS } = require("../utils/constants");

class UserService {
  async getAllUsers(filters = {}) {
    try {
      // Pagination
      const skip = parseInt(filters.skip || 0);
      const limit = parseInt(filters.limit || 10);

      // Get total count for pagination
      const total = await User.countDocuments();

      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return {
        success: true,
        count: users.length,
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        limit,
        users,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select("-password");

      if (!user) {
        const error = new Error("User not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        const error = new Error("User not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      return {
        success: true,
        message: "User updated successfully",
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUserRole(userId, role) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        const error = new Error("User not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      return {
        success: true,
        message: "User role updated successfully",
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUserStatus(userId, status) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        const error = new Error("User not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      return {
        success: true,
        message: "User status updated successfully",
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        const error = new Error("User not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      return {
        success: true,
        message: "User deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
