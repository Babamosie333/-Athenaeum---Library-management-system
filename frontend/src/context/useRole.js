import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

// Reads the role Clerk stores in publicMetadata. This is set manually (or via
// the admin-only PATCH /api/users/:id/role endpoint) — never trust a role
// coming from anywhere else, and never let the frontend set its own role.
export default function useRole() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      setRole(user?.publicMetadata?.role || "member");
    }
  }, [isLoaded, user]);

  return { role, isLoaded };
}
