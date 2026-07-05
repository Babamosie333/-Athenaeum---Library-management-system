const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const Reservation = require("../models/Reservation");

const LOAN_DAYS = 14;
const FINE_PER_DAY = 5; // currency units per day overdue

// POST /api/transactions/issue  { bookId }
exports.issueBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies < 1) {
      return res.status(400).json({ message: "No copies available. You can reserve this book instead." });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + LOAN_DAYS);

    const transaction = await Transaction.create({
      book: book._id,
      userId: req.user.id,
      userEmail: req.user.email,
      dueDate,
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/transactions/return  { transactionId }
exports.returnBook = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    if (transaction.status === "returned") {
      return res.status(400).json({ message: "Book already returned" });
    }

    const now = new Date();
    let fineAmount = 0;
    if (now > transaction.dueDate) {
      const daysLate = Math.ceil((now - transaction.dueDate) / (1000 * 60 * 60 * 24));
      fineAmount = daysLate * FINE_PER_DAY;
    }

    transaction.returnDate = now;
    transaction.status = "returned";
    transaction.fineAmount = fineAmount;
    await transaction.save();

    const book = await Book.findById(transaction.book);
    book.availableCopies += 1;
    await book.save();

    // Notify oldest waiting reservation, if any
    const nextReservation = await Reservation.findOne({ book: book._id, status: "waiting" }).sort({ createdAt: 1 });
    if (nextReservation) {
      nextReservation.status = "notified";
      await nextReservation.save();
      // Hook: trigger email/socket notification here
    }

    res.json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/transactions/my
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .populate("book")
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/transactions (admin) - all, with overdue flagging
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("book").sort({ createdAt: -1 });
    const now = new Date();
    const withStatus = transactions.map((t) => {
      const isOverdue = t.status === "borrowed" && now > t.dueDate;
      return { ...t.toObject(), status: isOverdue ? "overdue" : t.status };
    });
    res.json(withStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
