const Reservation = require("../models/Reservation");
const Book = require("../models/Book");

exports.createReservation = async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const existing = await Reservation.findOne({ book: bookId, userId: req.user.id, status: { $in: ["waiting", "notified"] } });
    if (existing) return res.status(400).json({ message: "You already have an active reservation for this book" });

    const reservation = await Reservation.create({
      book: bookId,
      userId: req.user.id,
      userEmail: req.user.email,
    });

    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id }).populate("book").sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "cancelled" },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
