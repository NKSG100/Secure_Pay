import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import { isAuthenticated } from "./utils/auth";

const App = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  // Listen for changes in authentication state
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthenticated(isAuthenticated());
    };

    // Add event listener for localStorage changes
    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar authenticated={authenticated} setAuthenticated={setAuthenticated} />
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                authenticated ? (
                  <DashboardPage />
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
            <Route
              path="/signin"
              element={<SignInPage setAuthenticated={setAuthenticated} />}
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/dashboard"
              element={
                authenticated ? (
                  <DashboardPage />
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;