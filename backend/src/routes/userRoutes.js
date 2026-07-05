const express = require("express");
const router = express.Router();
const { requireAuth, attachUser, requireAdmin } = require("../middleware/auth");
const { getMe, updateUserRole, listUsers } = require("../controllers/userController");

router.get("/me", requireAuth, attachUser, getMe);
router.get("/", requireAuth, attachUser, requireAdmin, listUsers);
router.patch("/:id/role", requireAuth, attachUser, requireAdmin, updateUserRole);

module.exports = router;
