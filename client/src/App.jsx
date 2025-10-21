import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import LocationSetupPage from "./pages/LocationSetupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import CommunityPage from "./pages/CommunityPage";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className='min-h-screen bg-white'>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route
            path='/signup'
            element={
              <SignupPage
                setUser={setUser}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path='/profile-setup'
            element={<ProfileSetupPage setUser={setUser} />}
          />
          <Route
            path='/location-setup'
            element={<LocationSetupPage setUser={setUser} />}
          />
          <Route path='/home' element={<HomePage user={user} />} />
          <Route
            path='/profile'
            element={<ProfilePage user={user} setUser={setUser} />}
          />
          <Route
            path='/create-community'
            element={<CreateCommunityPage user={user} />}
          />
          <Route
            path='/community/:id'
            element={<CommunityPage user={user} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
