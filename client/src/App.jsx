import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { authAPI } from "./services/api";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import LocationSetupPage from "./pages/LocationSetupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import EditCommunityPage from "./pages/EditCommunityPage";
import CommunityPage from "./pages/CommunityPage";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/signup"
            element={
              <SignupPage
                setUser={setUser}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                setUser={setUser}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/profile-setup"
            element={
              isAuthenticated ? (
                <ProfileSetupPage setUser={setUser} />
              ) : (
                <Navigate to="/signup" />
              )
            }
          />
          <Route
            path="/location-setup"
            element={
              isAuthenticated ? (
                <LocationSetupPage setUser={setUser} />
              ) : (
                <Navigate to="/signup" />
              )
            }
          />
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <HomePage user={user} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <ProfilePage user={user} setUser={setUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/create-community"
            element={
              isAuthenticated ? (
                <CreateCommunityPage user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/community/:id"
            element={
              isAuthenticated ? (
                <CommunityPage user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/community/:id/edit"
            element={
              isAuthenticated ? (
                <EditCommunityPage user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
