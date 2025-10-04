// src/pages/BooksList.jsx
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = async (pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/books?page=${pageNum}`);
      setBooks(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(" Failed to load books. Please try again.",err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📚 All Books</h1>
          <Link
            to="/add-book"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Add Book
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading books...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : books.length === 0 ? (
          <p className="text-center text-gray-600">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  ✍️ <strong>Author:</strong> {book.author}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  📅 <strong>Year:</strong> {book.year || "—"}
                </p>
                <p className="text-yellow-600 font-medium">
                  ⭐ {book.avgRating?.toFixed(1) || 0} ({book.reviewsCount || 0}{" "}
                  reviews)
                </p>
                <Link
                  to={`/books/${book._id}`}
                  className="block text-center bg-indigo-600 text-white mt-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-lg ${
              page <= 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-lg ${
              page >= totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BooksList;
