const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    status: { type: String, enum: ["waiting", "notified", "fulfilled", "cancelled"], default: "waiting" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
