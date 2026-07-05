import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <Link to={`/books/${book._id}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
      <div className="aspect-[2/3] bg-accent-light overflow-hidden">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-accent-dark font-serif text-sm px-3 text-center">
            {book.title}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-serif text-sm font-semibold text-ink truncate">{book.title}</h3>
        <p className="text-xs text-ink/60 mt-0.5">{book.author}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] uppercase tracking-wide text-accent-dark bg-accent-light px-2 py-0.5 rounded">
            {book.genre}
          </span>
          <span className={`text-xs ${book.availableCopies > 0 ? "text-accent-dark" : "text-red-500"}`}>
            {book.availableCopies > 0 ? `${book.availableCopies} available` : "Checked out"}
          </span>
        </div>
      </div>
    </Link>
  );
}
