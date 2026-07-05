const Book = require("../models/Book");
const { uploadBufferToCloudinary } = require("../config/cloudinary");

// GET /api/books?search=&genre=&page=&limit=
exports.getBooks = async (req, res) => {
  try {
    const { search, genre, page = 1, limit = 12 } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (genre) query.genre = genre;

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Book.countDocuments(query);

    res.json({ books, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin only
exports.createBook = async (req, res) => {
  try {
    const coverImage = req.file ? await uploadBufferToCloudinary(req.file.buffer) : "";
    const book = await Book.create({
      ...req.body,
      availableCopies: req.body.totalCopies,
      coverImage,
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.coverImage = await uploadBufferToCloudinary(req.file.buffer);
    const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Simple recommendation: same genre or author, excluding itself
exports.getSimilarBooks = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const similar = await Book.find({
      _id: { $ne: book._id },
      $or: [{ genre: book.genre }, { author: book.author }],
    }).limit(6);

    res.json(similar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
