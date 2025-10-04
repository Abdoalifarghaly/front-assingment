import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import BooksList from "./pages/BooksList";
import BookDetails from "./pages/BookDetails";
import AddBook from "./pages/AddBook";
import NotFound from "./pages/NotFound";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// ✅ هنا بنخلي useContext جوه مكون منفصل
function AppContent() {
  const { token } = useContext(AuthContext);

  return (
    <>
      {/* Navbar يظهر فقط بعد تسجيل الدخول */}
      {token && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/books/:id" element={<BookDetails />} />

        {/* Add / Edit protected */}
        <Route
          path="/add-book"
          element={
            <ProtectedRoute>
              <AddBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-book/:id"
          element={
            <ProtectedRoute>
              <AddBook />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// ✅ هنا الـ Provider يلف حوالين كل حاجة
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
