const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true },
    genre: { type: String, required: true },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" }, // Cloudinary URL
    totalCopies: { type: Number, required: true, min: 1 },
    availableCopies: { type: Number, required: true, min: 0 },
    publishedYear: { type: Number },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", author: "text", genre: "text" });

module.exports = mongoose.model("Book", bookSchema);
