import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import api from "../api/axios.js";
import useApi from "../api/useApi.js";
import BookCard from "../components/BookCard.jsx";

export default function BookDetails() {
  const { id } = useParams();
  const authedApi = useApi();
  const [book, setBook] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const load = () => {
    api.get(`/books/${id}`).then((res) => setBook(res.data));
    api.get(`/books/${id}/similar`).then((res) => setSimilar(res.data));
    api.get(`/reviews/book/${id}`).then((res) => setReviews(res.data));
  };

  useEffect(() => { load(); }, [id]);

  const handleBorrow = async () => {
    try {
      await authedApi.post("/transactions/issue", { bookId: id });
      setMessage("Book borrowed! Check My Borrows for the due date.");
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleReserve = async () => {
    try {
      await authedApi.post("/reservations", { bookId: id });
      setMessage("Reserved! You'll be notified when it's available.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await authedApi.post("/reviews", { bookId: id, rating, comment });
      setComment("");
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not submit review.");
    }
  };

  if (!book) return <p className="text-sm text-ink/50">Loading…</p>;

  return (
    <div>
      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <div className="aspect-[2/3] bg-accent-light rounded-lg overflow-hidden">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-accent-dark text-center px-4">{book.title}</div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-serif font-semibold">{book.title}</h1>
          <p className="text-ink/60 mt-1">{book.author} · {book.genre} {book.publishedYear ? `· ${book.publishedYear}` : ""}</p>
          <p className="mt-4 text-sm leading-relaxed text-ink/80">{book.description}</p>

          <div className="mt-4 text-sm">
            ★ {book.ratingAverage || "No ratings yet"} {book.ratingCount ? `(${book.ratingCount} reviews)` : ""}
          </div>

          <p className={`mt-3 text-sm ${book.availableCopies > 0 ? "text-accent-dark" : "text-red-500"}`}>
            {book.availableCopies > 0 ? `${book.availableCopies} of ${book.totalCopies} copies available` : "Currently checked out"}
          </p>

          <SignedIn>
            <div className="flex gap-3 mt-5">
              {book.availableCopies > 0 ? (
                <button onClick={handleBorrow} className="btn-primary">Borrow this book</button>
              ) : (
                <button onClick={handleReserve} className="btn-secondary">Reserve (join waitlist)</button>
              )}
            </div>
          </SignedIn>
          <SignedOut>
            <p className="text-sm text-ink/50 mt-4">Sign in to borrow or reserve this book.</p>
          </SignedOut>

          {message && <p className="text-sm mt-3 text-accent-dark">{message}</p>}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-serif font-semibold mb-4">Reviews</h2>
        <SignedIn>
          <form onSubmit={handleReview} className="card p-4 mb-6 max-w-lg">
            <label className="text-sm block mb-2">Your rating</label>
            <select className="input mb-3" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
            </select>
            <textarea
              className="input mb-3"
              rows={3}
              placeholder="Share your thoughts (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn-primary" type="submit">Submit review</button>
          </form>
        </SignedIn>

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{r.userName}</span>
                <span>★ {r.rating}</span>
              </div>
              {r.comment && <p className="text-sm text-ink/70 mt-1">{r.comment}</p>}
            </div>
          ))}
          {reviews.length === 0 && <p className="text-sm text-ink/50">No reviews yet.</p>}
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-serif font-semibold mb-4">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similar.map((b) => <BookCard key={b._id} book={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}
