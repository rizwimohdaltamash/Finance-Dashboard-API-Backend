const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign(
    {
      id: userId,
      role: role,
    },
    process.env.JWT_SECRET || "your-secret-key-change-in-production",
    {
      expiresIn: process.env.JWT_EXPIRATION || "7d",
    }
  );
};

module.exports = generateToken;
