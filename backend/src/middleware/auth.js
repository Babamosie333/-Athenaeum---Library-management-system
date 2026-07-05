const { ClerkExpressRequireAuth, clerkClient } = require("@clerk/clerk-sdk-node");

// Verifies the Clerk session token; attaches req.auth.userId
const requireAuth = ClerkExpressRequireAuth();

// Loads full Clerk user (to read role from publicMetadata) and attaches req.user
const attachUser = async (req, res, next) => {
  try {
    const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    req.user = {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      role: clerkUser.publicMetadata?.role || "member",
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Unable to verify user" });
  }
};

// Restricts route to admins only (use after requireAuth + attachUser)
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { requireAuth, attachUser, requireAdmin };
