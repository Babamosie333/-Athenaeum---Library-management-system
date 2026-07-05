const Review = require("../models/Review");
const Book = require("../models/Book");

const recalcBookRating = async (bookId) => {
  const reviews = await Review.find({ book: bookId });
  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  await Book.findByIdAndUpdate(bookId, { ratingAverage: avg.toFixed(1), ratingCount: count });
};

exports.addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const review = await Review.create({
      book: bookId,
      userId: req.user.id,
      userName: req.user.name || req.user.email,
      rating,
      comment,
    });
    await recalcBookRating(bookId);
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "You already reviewed this book" });
    res.status(400).json({ message: err.message });
  }
};

exports.getBookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!review) return res.status(404).json({ message: "Review not found" });
    await recalcBookRating(review.book);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
