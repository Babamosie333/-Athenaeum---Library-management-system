const express = require("express");
const router = express.Router();
const { requireAuth, attachUser } = require("../middleware/auth");
const {
  createReservation, getMyReservations, cancelReservation,
} = require("../controllers/reservationController");

router.post("/", requireAuth, attachUser, createReservation);
router.get("/my", requireAuth, attachUser, getMyReservations);
router.patch("/:id/cancel", requireAuth, attachUser, cancelReservation);

module.exports = router;
