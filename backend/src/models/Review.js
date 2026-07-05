const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

reviewSchema.index({ book: 1, userId: 1 }, { unique: true }); // one review per user per book

module.exports = mongoose.model("Review", reviewSchema);
