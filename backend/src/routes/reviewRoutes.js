const express = require("express");
const router = express.Router();
const { requireAuth, attachUser } = require("../middleware/auth");
const { addReview, getBookReviews, deleteReview } = require("../controllers/reviewController");

router.post("/", requireAuth, attachUser, addReview);
router.get("/book/:bookId", getBookReviews);
router.delete("/:id", requireAuth, attachUser, deleteReview);

module.exports = router;
