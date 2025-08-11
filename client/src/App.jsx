import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import LocationSetupPage from './pages/LocationSetupPage';
//import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/profile-setup" element={<ProfileSetupPage setUser={setUser} />} />
          <Route path="/location-setup" element={<LocationSetupPage setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

