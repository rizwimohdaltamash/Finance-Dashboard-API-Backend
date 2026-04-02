const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = (process.env.DATABASE_URL || process.env.MONGODB_URI || "").trim();

    if (!mongoURI) {
      throw new Error("DATABASE_URL or MONGODB_URI is not defined in environment variables");
    }

    if (mongoURI.includes("<username>") || mongoURI.includes("<password>") || mongoURI.includes("<cluster-url>")) {
      throw new Error("MongoDB connection string still contains placeholder values");
    }

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
