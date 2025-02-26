import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";

const SignInPage = ({ setAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        saveToken(data.token);
        setAuthenticated(true);
        navigate("/dashboard");
      } else {
        setError(data.msg || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 transform hover:scale-105 transition-transform duration-300 hover:shadow-purple-500/50">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center animate-pulse">
          Sign In
        </h2>
        {error && <div className="text-red-500 text-center">{error}</div>}

        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-4 mt-2 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full p-4 mt-2 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-300">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;