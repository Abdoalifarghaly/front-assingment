import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

const AddBook = () => {
  const { id } = useParams(); // لو موجود يبقى Edit
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    year: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  // 🧠 لو الصفحة Edit نحمل بيانات الكتاب القديم
  useEffect(() => {
    if (isEdit) {
      const fetchBook = async () => {
        try {
          const res = await api.get(`/books/${id}`);
          setBook({
            title: res.data.title,
            author: res.data.author,
            description: res.data.description,
            genre: res.data.genre,
            year: res.data.year,
          });
        } catch (err) {
          setMsg(" Failed to load book details.",err);
        }
      };
      fetchBook();
    }
  }, [id, isEdit]);

  // 🧠 Submit Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!book.title || !book.author) {
      setMsg(" Title and Author are required.");
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/books/${id}`, book);
        setMsg(" Book updated successfully!");
      } else {
        await api.post("/books", book);
        setMsg(" Book added successfully!");
        setBook({ title: "", author: "", description: "", genre: "", year: "" });
      }
      setTimeout(() => navigate("/books"), 1000);
    } catch (err) {
      setMsg(" Failed to save book. Make sure you are logged in.",err);
    } finally {
      setLoading(false);
    }
  };

  if (!token)
    return (
      <p className="text-center mt-10 text-gray-600">
         Please <a href="/login" className="text-indigo-600 underline">login</a> to add or edit books.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-teal-100 to-cyan-100 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isEdit ? "✏️ Edit Book" : "➕ Add New Book"}
        </h2>

        {msg && <p className="text-center text-indigo-700 mb-4">{msg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={book.author}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
          <textarea
            placeholder="Description"
            value={book.description}
            onChange={(e) => setBook({ ...book, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            rows="4"
          ></textarea>
          <input
            type="text"
            placeholder="Genre"
            value={book.genre}
            onChange={(e) => setBook({ ...book, genre: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Published Year"
            value={book.year}
            onChange={(e) => setBook({ ...book, year: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Saving..." : isEdit ? "Update Book" : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
