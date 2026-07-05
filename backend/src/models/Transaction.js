const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    userId: { type: String, required: true }, // Clerk user id
    userEmail: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    status: { type: String, enum: ["borrowed", "returned", "overdue"], default: "borrowed" },
    fineAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
