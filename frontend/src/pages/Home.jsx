import { useEffect, useState } from "react";
import api from "../api/axios.js";
import BookCard from "../components/BookCard.jsx";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/books", { params: { search, genre, page } })
      .then((res) => {
        setBooks(res.data.books);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [search, genre, page]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold">Catalog</h1>
        <p className="text-ink/60 mt-1 text-sm">Browse the collection and reserve or borrow a title.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          className="input sm:max-w-xs"
          placeholder="Search by title, author, or genre"
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
        />
        <select
          className="input sm:max-w-[180px]"
          value={genre}
          onChange={(e) => { setPage(1); setGenre(e.target.value); }}
        >
          <option value="">All genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Fantasy">Fantasy</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-ink/50">Loading books…</p>
      ) : books.length === 0 ? (
        <p className="text-sm text-ink/50">No books found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((b) => <BookCard key={b._id} book={b} />)}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded text-sm ${p === page ? "bg-accent text-paper" : "border border-border"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
