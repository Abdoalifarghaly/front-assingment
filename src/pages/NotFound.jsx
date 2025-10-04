import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="mb-6 text-gray-600">not found</p>
      <Link to="/books" className="bg-indigo-600 text-white px-4 py-2 rounded">
        back to book
      </Link>
    </div>
  </div>
);

export default NotFound;
