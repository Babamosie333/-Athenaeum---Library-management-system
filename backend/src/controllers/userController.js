const { clerkClient } = require("@clerk/clerk-sdk-node");

// GET /api/users/me - return current user profile + role
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// PATCH /api/users/:id/role  (admin only) { role: "admin" | "member" }
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    await clerkClient.users.updateUserMetadata(req.params.id, {
      publicMetadata: { role },
    });
    res.json({ message: `Role updated to ${role}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/users (admin only) - list all Clerk users
exports.listUsers = async (req, res) => {
  try {
    const users = await clerkClient.users.getUserList({ limit: 100 });
    const simplified = users.map((u) => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress,
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
      role: u.publicMetadata?.role || "member",
    }));
    res.json(simplified);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
