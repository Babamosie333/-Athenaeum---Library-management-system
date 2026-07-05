import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "./components/Navbar.jsx";
import Background3D from "./components/Background3D.jsx";
import useRole from "./context/useRole.js";
import Home from "./pages/Home.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import MyBorrows from "./pages/MyBorrows.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

function Protected({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function RequireAdmin({ children }) {
  const { role, isLoaded } = useRole();

  return (
    <Protected>
      {!isLoaded ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : role === "admin" ? (
        children
      ) : (
        <div className="card p-6 max-w-md">
          <h2 className="font-serif text-lg font-semibold mb-1">Admins only</h2>
          <p className="text-sm text-ink/60">You don't have access to this page.</p>
        </div>
      )}
    </Protected>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Background3D />
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route
            path="/my-borrows"
            element={
              <Protected>
                <MyBorrows />
              </Protected>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAdmin>
                <Dashboard />
              </RequireAdmin>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
