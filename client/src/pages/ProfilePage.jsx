import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Edit,
  MapPin,
  Calendar,
  GraduationCap,
  Users,
} from "lucide-react";

function ProfilePage({ user, setUser }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "John Doe",
    age: user?.age || "21",
    college: user?.college || "UCLA",
    bio:
      user?.bio ||
      "Computer Science student passionate about technology and innovation. Love coding, gaming, and meeting new people!",
    graduationYear: user?.graduationYear || "2025",
    interests: user?.interests || [
      "Technology",
      "Gaming",
      "Photography",
      "Music",
    ],
  });

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
  ];

  const handleSave = () => {
    setUser((prev) => ({ ...prev, ...editData }));
    setIsEditing(false);
  };

  const handleInterestToggle = (interest) => {
    setEditData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-4'>
            <button
              onClick={() => navigate("/home")}
              className='flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
              <span>Back to Home</span>
            </button>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className='bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2'
            >
              <Edit className='w-4 h-4' />
              <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
          {/* Cover Photo */}
          <div className='h-48 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 relative'>
            <div className='absolute inset-0 bg-black/20'></div>
          </div>

          {/* Profile Content */}
          <div className='relative px-8 pb-8'>
            {/* Profile Picture */}
            <div className='flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16 relative z-10'>
              <div className='relative'>
                <div className='w-32 h-32 bg-white rounded-full p-2 shadow-lg'>
                  <div className='w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden'>
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt='Profile'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <Users className='w-16 h-16 text-gray-400' />
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button className='absolute bottom-2 right-2 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors'>
                    <Camera className='w-4 h-4' />
                  </button>
                )}
              </div>

              <div className='mt-4 sm:mt-0 flex-1'>
                {isEditing ? (
                  <input
                    type='text'
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className='text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-purple-500 focus:outline-none'
                  />
                ) : (
                  <h1 className='text-3xl font-bold text-gray-900'>
                    {editData.name}
                  </h1>
                )}
                <div className='flex flex-wrap items-center gap-4 mt-2 text-gray-600'>
                  <div className='flex items-center space-x-1'>
                    <GraduationCap className='w-4 h-4' />
                    {isEditing ? (
                      <input
                        type='text'
                        value={editData.college}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            college: e.target.value,
                          }))
                        }
                        className='bg-transparent border-b border-gray-300 focus:outline-none focus:border-purple-500'
                      />
                    ) : (
                      <span>{editData.college}</span>
                    )}
                  </div>
                  <div className='flex items-center space-x-1'>
                    <Calendar className='w-4 h-4' />
                    {isEditing ? (
                      <input
                        type='text'
                        value={editData.graduationYear}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            graduationYear: e.target.value,
                          }))
                        }
                        className='bg-transparent border-b border-gray-300 focus:outline-none focus:border-purple-500 w-16'
                      />
                    ) : (
                      <span>Class of {editData.graduationYear}</span>
                    )}
                  </div>
                  <div className='flex items-center space-x-1'>
                    <MapPin className='w-4 h-4' />
                    <span>
                      {user?.location?.city}, {user?.location?.state}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className='mt-8'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                About Me
              </h2>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows='4'
                  className='w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                />
              ) : (
                <p className='text-gray-700 leading-relaxed'>{editData.bio}</p>
              )}
            </div>

            {/* Interests Section */}
            <div className='mt-8'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Interests{" "}
                {isEditing && `(${editData.interests.length} selected)`}
              </h2>
              {isEditing ? (
                <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      type='button'
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        editData.interests.includes(interest)
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  {editData.interests.map((interest) => (
                    <span
                      key={interest}
                      className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium'
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl'>
                <div className='text-2xl font-bold text-gray-900'>5</div>
                <div className='text-gray-600'>Communities Joined</div>
              </div>
              <div className='bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-xl'>
                <div className='text-2xl font-bold text-gray-900'>12</div>
                <div className='text-gray-600'>Events Attended</div>
              </div>
              <div className='bg-gradient-to-r from-teal-50 to-purple-50 p-6 rounded-xl'>
                <div className='text-2xl font-bold text-gray-900'>48</div>
                <div className='text-gray-600'>Connections Made</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
