import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import useApi from "../api/useApi.js";

export default function Dashboard() {
  const api = useApi();
  const [tab, setTab] = useState("overview");
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", isbn: "", genre: "Fiction", totalCopies: 1, description: "" });
  const [coverFile, setCoverFile] = useState(null);
  const [message, setMessage] = useState("");

  const loadBooks = () => api.get("/books", { params: { limit: 100 } }).then((res) => setBooks(res.data.books));
  const loadTransactions = () => api.get("/transactions").then((res) => setTransactions(res.data));

  useEffect(() => { loadBooks(); loadTransactions(); }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (coverFile) data.append("cover", coverFile);
      await api.post("/books", data, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage("Book added.");
      setForm({ title: "", author: "", isbn: "", genre: "Fiction", totalCopies: 1, description: "" });
      setCoverFile(null);
      loadBooks();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add book.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this book?")) return;
    await api.delete(`/books/${id}`);
    loadBooks();
  };

  const handleReturn = async (transactionId) => {
    await api.post("/transactions/return", { transactionId });
    loadTransactions();
    loadBooks();
  };

  const genreCounts = books.reduce((acc, b) => {
    acc[b.genre] = (acc[b.genre] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }));

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-8 border-b border-border">
        {["overview", "books", "transactions"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize border-b-2 -mb-px ${tab === t ? "border-accent text-accent-dark font-medium" : "border-transparent text-ink/60"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-4"><p className="text-xs text-ink/50">Total Books</p><p className="text-2xl font-serif mt-1">{books.length}</p></div>
          <div className="card p-4"><p className="text-xs text-ink/50">Active Borrows</p><p className="text-2xl font-serif mt-1">{transactions.filter(t => t.status === "borrowed" || t.status === "overdue").length}</p></div>
          <div className="card p-4"><p className="text-xs text-ink/50">Overdue</p><p className="text-2xl font-serif mt-1">{transactions.filter(t => t.status === "overdue").length}</p></div>

          <div className="card p-4 sm:col-span-3">
            <p className="text-sm font-medium mb-3">Books by Genre</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <XAxis dataKey="genre" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3F5D45" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "books" && (
        <div className="grid md:grid-cols-[320px_1fr] gap-8">
          <form onSubmit={handleAddBook} className="card p-4 space-y-3 h-fit">
            <h3 className="font-serif font-semibold">Add a Book</h3>
            <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input className="input" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            <input className="input" placeholder="ISBN" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required />
            <select className="input" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
              <option>Fiction</option><option>Non-Fiction</option><option>Science</option><option>History</option><option>Fantasy</option>
            </select>
            <input className="input" type="number" min="1" placeholder="Total copies" value={form.totalCopies} onChange={(e) => setForm({ ...form, totalCopies: e.target.value })} required />
            <textarea className="input" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="input" type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} />
            <button className="btn-primary w-full" type="submit">Add Book</button>
            {message && <p className="text-xs text-accent-dark">{message}</p>}
          </form>

          <div className="space-y-2">
            {books.map((b) => (
              <div key={b._id} className="card p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{b.title}</p>
                  <p className="text-xs text-ink/60">{b.author} · {b.availableCopies}/{b.totalCopies} available</p>
                </div>
                <button onClick={() => handleDelete(b._id)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "transactions" && (
        <div className="space-y-2">
          {transactions.map((t) => (
            <div key={t._id} className="card p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t.book?.title}</p>
                <p className="text-xs text-ink/60">{t.userEmail} · Due {new Date(t.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  t.status === "returned" ? "bg-accent-light text-accent-dark"
                  : t.status === "overdue" ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-700"
                }`}>{t.status}</span>
                {t.status !== "returned" && (
                  <button onClick={() => handleReturn(t._id)} className="text-xs btn-secondary !px-3 !py-1">Mark Returned</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
