import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/books" className="text-xl font-bold">📚 BookApp</Link>

        <div className="flex items-center space-x-4">
          <Link to="/books" className="hover:underline">Books</Link>

          {token && (
            <Link to="/add-book" className="hover:underline">
              + Add Book
            </Link>
          )}

          {token ? (
            <>
              <span className="hidden sm:inline text-sm">Hi, {user?.name || "User"}</span>
              <button
                onClick={handleLogout}
                className="ml-2 bg-white text-indigo-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
