import { useEffect, useState } from "react";
import useApi from "../api/useApi.js";

export default function MyBorrows() {
  const api = useApi();
  const [transactions, setTransactions] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    api.get("/transactions/my").then((res) => setTransactions(res.data));
    api.get("/reservations/my").then((res) => setReservations(res.data));
  }, []);

  const isOverdue = (t) => t.status === "borrowed" && new Date() > new Date(t.dueDate);

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold mb-6">My Borrows</h1>

      <div className="space-y-3 mb-10">
        {transactions.length === 0 && <p className="text-sm text-ink/50">No borrowing history yet.</p>}
        {transactions.map((t) => (
          <div key={t._id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{t.book?.title}</p>
              <p className="text-xs text-ink/60 mt-0.5">
                Issued {new Date(t.issueDate).toLocaleDateString()} · Due {new Date(t.dueDate).toLocaleDateString()}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              t.status === "returned" ? "bg-accent-light text-accent-dark"
              : isOverdue(t) ? "bg-red-50 text-red-600"
              : "bg-yellow-50 text-yellow-700"
            }`}>
              {t.status === "returned" ? "Returned" : isOverdue(t) ? "Overdue" : "Borrowed"}
              {t.fineAmount > 0 ? ` · Fine ₹${t.fineAmount}` : ""}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-serif font-semibold mb-4">My Reservations</h2>
      <div className="space-y-3">
        {reservations.length === 0 && <p className="text-sm text-ink/50">No active reservations.</p>}
        {reservations.map((r) => (
          <div key={r._id} className="card p-4 flex items-center justify-between">
            <p className="font-medium text-sm">{r.book?.title}</p>
            <span className="text-xs px-2 py-1 rounded bg-accent-light text-accent-dark capitalize">{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
