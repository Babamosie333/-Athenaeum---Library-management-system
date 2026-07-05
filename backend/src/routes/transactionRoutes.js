const express = require("express");
const router = express.Router();
const { requireAuth, attachUser, requireAdmin } = require("../middleware/auth");
const {
  issueBook, returnBook, getMyTransactions, getAllTransactions,
} = require("../controllers/transactionController");

router.post("/issue", requireAuth, attachUser, issueBook);
router.post("/return", requireAuth, attachUser, requireAdmin, returnBook);
router.get("/my", requireAuth, attachUser, getMyTransactions);
router.get("/", requireAuth, attachUser, requireAdmin, getAllTransactions);

module.exports = router;
