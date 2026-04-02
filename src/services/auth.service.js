const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { HTTP_STATUS, ROLES } = require("../utils/constants");

class AuthService {
  async register(name, email, password, role) {
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        const error = new Error("User already exists with this email");
        error.statusCode = HTTP_STATUS.CONFLICT;
        throw error;
      }

      const selectedRole = role && Object.values(ROLES).includes(role)
        ? role
        : ROLES.VIEWER;

      const user = new User({
        name,
        email,
        password,
        role: selectedRole,
        status: "ACTIVE",
      });

      await user.save();

      const token = generateToken(user._id, user.role);

      return {
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        const error = new Error("User not registered. Please register first.");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      const isPasswordValid = await user.matchPassword(password);

      if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = HTTP_STATUS.UNAUTHORIZED;
        throw error;
      }

      const token = generateToken(user._id, user.role);

      return {
        success: true,
        message: "Logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(userId) {
    try {
      const user = await User.findById(userId).select("-password");

      if (!user) {
        const error = new Error("User not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
      }

      return {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
