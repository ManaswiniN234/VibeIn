import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Edit,
  MapPin,
  Calendar,
  GraduationCap,
  Users,
  LogOut,
  Image,
  Trash2,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { authAPI } from "../services/api";

function ProfilePage({ user, setUser, onLogout }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileUser, setProfileUser] = useState(null);
  const [expandedType, setExpandedType] = useState(null); // 'created' or 'joined'
  const [editData, setEditData] = useState({
    name: "",
    age: "",
    college: "",
    bio: "",
    graduationYear: "",
    interests: [],
    profilePicture: null,
    banner: null,
  });

  const [emailData, setEmailData] = useState({
    newEmail: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setInitialLoading(true);
        const response = await authAPI.getProfile();
        if (response.success) {
          setProfileUser(response.user);
          setEditData({
            name: response.user.name || "",
            age: response.user.age || "",
            college: response.user.college || "",
            bio: response.user.bio || "",
            graduationYear: response.user.graduationYear || "",
            interests: response.user.interests || [],
            profilePicture: response.user.profilePicture || null,
            banner: response.user.banner || null,
          });
        } else {
          setError(response.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("An error occurred while loading your profile");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const availableInterests = [
    "Gaming",
    "Photography",
    "Music",
    "Sports",
    "Art",
    "Technology",
    "Reading",
    "Cooking",
    "Travel",
    "Fitness",
    "Movies",
    "Dancing",
    "Writing",
    "Coding",
    "Fashion",
    "Volunteering",
    "Entrepreneurship",
    "Meditation",
    "Hiking",
    "Board Games",
    "Anime",
    "Podcasts"
  ];

  const handleSave = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.updateProfile({
        name: editData.name,
        age: parseInt(editData.age),
        college: editData.college,
        bio: editData.bio,
        graduationYear: parseInt(editData.graduationYear),
        interests: editData.interests,
        profilePicture: editData.profilePicture,
        banner: editData.banner,
      });

      if (response.success) {
        setProfileUser(response.user);
        setUser(response.user);
        setIsEditing(false);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const handleInterestToggle = (interest) => {
    setEditData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({
          ...prev,
          banner: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await authAPI.deleteAccount();
      if (response.success) {
        setUser(null);
        onLogout();
        navigate('/');
      } else {
        setError(response.message || 'Failed to delete account');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('An error occurred while deleting your account');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!emailData.newEmail) {
      setError('Please enter a new email');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.updateProfile({ email: emailData.newEmail });
      if (response.success) {
        setProfileUser(response.user);
        setUser(response.user);
        setShowEmailEdit(false);
        setEmailData({ newEmail: "" });
      } else {
        setError(response.message || 'Failed to change email');
      }
    } catch (err) {
      console.error('Error changing email:', err);
      setError('An error occurred while changing your email');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (response.success) {
        setShowPasswordEdit(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError('An error occurred while changing your password');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching profile
  if (initialLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block'>
            <div className='w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin'></div>
          </div>
          <p className='text-gray-600 mt-4'>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 gap-2">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors min-w-fit"
            >
              <ArrowLeft className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="inline sm:hidden">Back</span>
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">{isEditing ? (loading ? "Saving..." : "Save Changes") : "Edit Profile"}</span>
                <span className="inline sm:hidden">{isEditing ? (loading ? "Saving..." : "Save") : "Edit"}</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
                <span className="inline sm:hidden">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Cover Photo / Banner */}
          <div className="h-48 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 relative overflow-hidden">
            {isEditing && (
              <label className="absolute inset-0 cursor-pointer group flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all">
                {editData.banner ? (
                  <img src={editData.banner} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400">
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                  disabled={loading}
                />
                <span className="absolute text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                  <Image className="w-4 h-4" />
                  <span>Change Banner</span>
                </span>
              </label>
            )}
            {!isEditing && editData.banner && (
              <img src={editData.banner} alt="Banner" className="w-full h-full object-cover" />
            )}
            {!isEditing && !editData.banner && (
              <div className="absolute inset-0 bg-black/20"></div>
            )}
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-col lg:flex-row lg:items-end lg:space-x-6 -mt-8 relative z-10 items-center lg:items-end">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative group">
                    {isEditing ? (
                      editData.profilePicture ? (
                        <img
                          src={editData.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : profileUser?.profilePicture ? (
                        <img
                          src={profileUser.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-16 h-16 text-gray-400" />
                      )
                    ) : profileUser?.profilePicture ? (
                      <img
                        src={profileUser.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-16 h-16 text-gray-400" />
                    )}
                    {isEditing && (
                      <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all rounded-full">
                        <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                          disabled={loading}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    disabled={loading}
                    className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-purple-500 focus:outline-none disabled:opacity-50"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900">
                    {editData.name}
                  </h1>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <GraduationCap className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.college}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            college: e.target.value,
                          }))
                        }
                        disabled={loading}
                        className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                      />
                    ) : (
                      <span>{editData.college}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.graduationYear}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            graduationYear: e.target.value,
                          }))
                        }
                        disabled={loading}
                        className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-purple-500 w-16 disabled:opacity-50"
                      />
                    ) : (
                      <span>Class of {editData.graduationYear}</span>
                    )}
                  </div>
                  {profileUser?.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {profileUser.location.city}, {profileUser.location.state}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About Me
              </h2>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  disabled={loading}
                  rows="4"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{editData.bio}</p>
              )}
            </div>

            {/* Interests Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Interests{" "}
                {isEditing && `(${editData.interests.length} selected)`}
              </h2>
              {isEditing ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        editData.interests.includes(interest)
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {editData.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Account Security Section */}
            {isEditing && (
              <div className="mt-8 space-y-6">
                {/* Change Email Form */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowEmailEdit(!showEmailEdit)}
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                    disabled={loading}
                  >
                    <Mail className="w-5 h-5" />
                    <span>Change Email</span>
                  </button>
                  
                  {showEmailEdit && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      {error && (
                        <div className="mb-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                          {error}
                        </div>
                      )}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Email Address
                          </label>
                          <input
                            type="email"
                            value={emailData.newEmail}
                            onChange={(e) =>
                              setEmailData({ ...emailData, newEmail: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="your-new-email@example.com"
                            disabled={loading}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={handleChangeEmail}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
                          >
                            {loading ? "Updating..." : "Update Email"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowEmailEdit(false);
                              setEmailData({ newEmail: "" });
                              setError("");
                            }}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Change Password Form */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordEdit(!showPasswordEdit)}
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                    disabled={loading}
                  >
                    <Lock className="w-5 h-5" />
                    <span>Change Password</span>
                  </button>
                  
                  {showPasswordEdit && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
                      {error && (
                        <div className="mb-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                          {error}
                        </div>
                      )}
                      <div className="space-y-3">
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  currentPassword: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Enter your current password"
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              disabled={loading}
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  newPassword: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Enter new password (min 6 characters)"
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              disabled={loading}
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirmPassword: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Confirm your new password"
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              disabled={loading}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={handleChangePassword}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium"
                          >
                            {loading ? "Updating..." : "Update Password"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowPasswordEdit(false);
                              setPasswordData({
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: "",
                              });
                              setError("");
                            }}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats Section */}
            <div className="mt-8 space-y-4">
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedType(expandedType === 'created' ? null : 'created')}
                  className="w-full bg-gradient-to-r from-purple-50 to-blue-50 p-6 hover:shadow-lg transition-shadow cursor-pointer text-left flex items-center justify-between"
                >
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {profileUser?.createdCommunities?.length || 0}
                    </div>
                    <div className="text-gray-600">Communities Created</div>
                  </div>
                  <div className={`transition-transform duration-300 ${expandedType === 'created' ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>
                
                {expandedType === 'created' && (
                  <div className="border-t border-gray-200 p-6 bg-white space-y-3">
                    {profileUser?.createdCommunities && profileUser.createdCommunities.length > 0 ? (
                      profileUser.createdCommunities.map((community) => (
                        <div
                          key={community._id}
                          onClick={() => navigate(`/community/${community._id}`)}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {community.name}
                              </h3>
                              {community.description && (
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                  {community.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{community.members?.length || 0} members</span>
                                </div>
                                {community.category && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                    {community.category}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowLeft className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0 rotate-180" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No communities created yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedType(expandedType === 'joined' ? null : 'joined')}
                  className="w-full bg-gradient-to-r from-blue-50 to-teal-50 p-6 hover:shadow-lg transition-shadow cursor-pointer text-left flex items-center justify-between"
                >
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {profileUser?.joinedCommunities?.length || 0}
                    </div>
                    <div className="text-gray-600">Communities Joined</div>
                  </div>
                  <div className={`transition-transform duration-300 ${expandedType === 'joined' ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>
                
                {expandedType === 'joined' && (
                  <div className="border-t border-gray-200 p-6 bg-white space-y-3">
                    {profileUser?.joinedCommunities && profileUser.joinedCommunities.length > 0 ? (
                      profileUser.joinedCommunities.map((community) => (
                        <div
                          key={community._id}
                          onClick={() => navigate(`/community/${community._id}`)}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {community.name}
                              </h3>
                              {community.description && (
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                  {community.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{community.members?.length || 0} members</span>
                                </div>
                                {community.category && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {community.category}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowLeft className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0 rotate-180" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No communities joined yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Delete Account Button */}
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="w-full mt-8 bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                title="Delete account permanently"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

