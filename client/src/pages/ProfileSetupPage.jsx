import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, User, Calendar, GraduationCap, FileText, X } from 'lucide-react';

function ProfileSetupPage({ setUser }) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    profilePicture: null,
    name: '',
    age: '',
    college: '',
    bio: '',
    graduationYear: '',
    interests: []
  });

  const availableInterests = [
    'Gaming', 'Photography', 'Music', 'Sports', 'Art', 'Technology', 'Reading', 'Cooking',
    'Travel', 'Fitness', 'Movies', 'Dancing', 'Writing', 'Coding', 'Fashion', 'Volunteering',
    'Entrepreneurship', 'Meditation', 'Hiking', 'Board Games', 'Anime', 'Podcasts'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, ...profileData }));
    navigate('/location-setup');
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestToggle = (interest) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Profile</h1>
          <p className="text-gray-600">Tell us about yourself to find your perfect community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profileData.profilePicture ? (
                    <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={profileData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your age"
                  min="16"
                  max="30"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College/University
                </label>
                <input
                  type="text"
                  name="college"
                  value={profileData.college}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your college name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  value={profileData.graduationYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="2025"
                  min="2024"
                  max="2030"
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tell us about yourself, your hobbies, and what you're looking for in a community..."
                required
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Interests ({profileData.interests.length} selected)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableInterests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      profileData.interests.includes(interest)
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Continue to Location Setup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetupPage;