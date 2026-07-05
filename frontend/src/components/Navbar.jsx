import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import useRole from "../context/useRole.js";

export default function Navbar() {
  const { role } = useRole();
  return (
    <header className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-semibold text-ink">
          Athenaeum
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-accent transition-colors">Catalog</Link>

          <SignedIn>
            <Link to="/my-borrows" className="hover:text-accent transition-colors">My Borrows</Link>
            {role === "admin" && (
              <Link to="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
            )}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <Link to="/sign-in" className="btn-secondary">Sign In</Link>
            <Link to="/sign-up" className="btn-primary">Sign Up</Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
