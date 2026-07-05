const express = require("express");
const cors = require("cors");

const bookRoutes = require("./routes/bookRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

module.exports = app;
