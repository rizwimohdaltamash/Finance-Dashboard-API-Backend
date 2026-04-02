const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
      min: 0,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Please specify transaction type"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Please provide a date"],
    },
    note: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Transaction must be created by a user"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
