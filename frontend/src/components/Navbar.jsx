import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUserFromToken, logout } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-400 transition-colors duration-300">
          Secure Pay
        </Link>
        <div className="flex items-center space-x-6">
          {isAuthenticated() ? (
            <>
              <span className="text-blue-400">Welcome {user?.username}</span>
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="hover:text-blue-400 transition-colors duration-300">
                Sign In
              </Link>
              <Link to="/signup" className="hover:text-blue-400 transition-colors duration-300">
                Sign Up
              </Link>
            </>
          )}
          <Link to="/about" className="hover:text-blue-400 transition-colors duration-300">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;