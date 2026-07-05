const express = require("express");
const router = express.Router();
const { requireAuth, attachUser, requireAdmin } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const {
  getBooks, getBookById, createBook, updateBook, deleteBook, getSimilarBooks,
} = require("../controllers/bookController");

router.get("/", getBooks);
router.get("/:id", getBookById);
router.get("/:id/similar", getSimilarBooks);

router.post("/", requireAuth, attachUser, requireAdmin, upload.single("cover"), createBook);
router.patch("/:id", requireAuth, attachUser, requireAdmin, upload.single("cover"), updateBook);
router.delete("/:id", requireAuth, attachUser, requireAdmin, deleteBook);

module.exports = router;
