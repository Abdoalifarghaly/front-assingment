import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

const BookDetails = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, reviewTxt: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  //  Fetch book details
  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/books/${id}`);
      setBook(res.data);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setMsg(" Failed to load book details.",err);
    } finally {
      setLoading(false);
    }
  };

  //  Add review
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.rating) {
      setMsg(" Please select a rating.");
      return;
    }

    try {
      const res = await api.post("/reviews", { bookId: id, ...newReview });
      setReviews([res.data, ...reviews]);
      setNewReview({ rating: 0, reviewTxt: "" });
      setMsg(" Review added successfully!");
    } catch (err) {
      setMsg(" Failed to add review. Make sure you're logged in.",err);
    }
  };

  //  Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      setMsg("🗑️ Review deleted successfully.");
    } catch (err) {
      setMsg(" Failed to delete review.",err);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!book) return <p className="text-center mt-10 text-red-600">{msg}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Book Info */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">{book.title}</h1>
        <p className="text-gray-600 mb-1">
           <strong>Author:</strong> {book.author}
        </p>
        <p className="text-gray-600 mb-1">
           <strong>Year:</strong> {book.year || "—"}
        </p>
        <p className="text-gray-600 mb-1">
           <strong>Genre:</strong> {book.genre || "—"}
        </p>
        <p className="text-yellow-600 font-semibold mt-2">
          ⭐ Average Rating:{" "}
          {book.reviews?.length
            ? (
                book.reviews.reduce((a, r) => a + r.rating, 0) /
                book.reviews.length
              ).toFixed(1)
            : "No ratings yet"}
        </p>
        <p className="mt-4 text-gray-700 leading-relaxed">{book.description}</p>

        {/* Divider */}
        <hr className="my-6 border-gray-300" />

        {/* Add Review */}
        {token ? (
          <form
            onSubmit={handleAddReview}
            className="bg-gray-50 p-4 rounded-xl shadow-sm mb-6"
          >
            <h3 className="text-lg font-semibold mb-3">Add a Review</h3>

            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: Number(e.target.value) })
              }
              className="w-full border border-gray-300 rounded-lg p-2 mb-3"
              required
            >
              <option value={0}>Select Rating</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && "s"}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Write your review..."
              value={newReview.reviewTxt}
              onChange={(e) =>
                setNewReview({ ...newReview, reviewTxt: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 mb-3"
              rows="3"
              required
            ></textarea>

            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-600">
             Please <a href="/login" className="text-indigo-600 underline">login</a> to add a review.
          </p>
        )}

        {/* Message */}
        {msg && <p className="text-center text-indigo-600 mb-3">{msg}</p>}

        {/* Reviews Section */}
        <h3 className="text-xl font-semibold mb-4">Reviews</h3>

        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">
                    {r.userId?.name || "Anonymous"}
                  </p>
                  <span className="text-yellow-600">⭐ {r.rating}</span>
                </div>
                <p className="text-gray-700 mt-2">{r.reviewTxt}</p>
                {user && r.userId?._id === user.id && (
                  <button
                    onClick={() => handleDeleteReview(r._id)}
                    className="text-red-500 text-sm mt-2 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
