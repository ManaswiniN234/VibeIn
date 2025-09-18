import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Users,
  MapPin,
  Link,
  Calendar,
  Hash,
} from "lucide-react";

function CreateCommunityPage({ user }) {
  const navigate = useNavigate();
  const [communityData, setCommunityData] = useState({
    name: "",
    description: "",
    category: "",
    banner: null,
    profilePicture: null,
    groupLink: "",
    nextHangout: "",
    tags: [],
  });

  const categories = [
    "Technology",
    "Arts",
    "Fitness",
    "Literature",
    "Gaming",
    "Music",
    "Sports",
    "Food",
    "Travel",
    "Photography",
    "Business",
    "Science",
  ];

  const suggestedTags = [
    "Beginner Friendly",
    "Weekly Meetups",
    "Online & Offline",
    "Project Based",
    "Networking",
    "Learning",
    "Social",
    "Competitive",
    "Creative",
    "Professional",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate community creation
    console.log("Creating community:", communityData);
    navigate("/home");
  };

  const handleChange = (e) => {
    setCommunityData({
      ...communityData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (type) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCommunityData((prev) => ({
          ...prev,
          [type]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag) => {
    setCommunityData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
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
            <h1 className='text-xl font-semibold text-gray-900'>
              Create Community
            </h1>
            <div className='w-20'></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
          <form onSubmit={handleSubmit} className='space-y-8'>
            {/* Banner Upload */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-4'>
                Community Banner
              </label>
              <div className='relative'>
                <div className='w-full h-48 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center overflow-hidden'>
                  {communityData.banner ? (
                    <img
                      src={communityData.banner}
                      alt='Banner'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='text-center'>
                      <Camera className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                      <p className='text-gray-500'>Upload a banner image</p>
                    </div>
                  )}
                </div>
                <label className='absolute bottom-4 right-4 bg-purple-500 text-white p-3 rounded-full cursor-pointer hover:bg-purple-600 transition-colors'>
                  <Camera className='w-5 h-5' />
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload("banner")}
                    className='hidden'
                  />
                </label>
              </div>
            </div>

            {/* Profile Picture and Basic Info */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-4'>
                  Community Logo
                </label>
                <div className='relative'>
                  <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden'>
                    {communityData.profilePicture ? (
                      <img
                        src={communityData.profilePicture}
                        alt='Logo'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <Users className='w-12 h-12 text-gray-400' />
                    )}
                  </div>
                  <label className='absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors'>
                    <Camera className='w-4 h-4' />
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload("profilePicture")}
                      className='hidden'
                    />
                  </label>
                </div>
              </div>

              <div className='md:col-span-2 space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Community Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={communityData.name}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    placeholder='Enter community name'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category
                  </label>
                  <select
                    name='category'
                    value={communityData.category}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    required
                  >
                    <option value=''>Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description
              </label>
              <textarea
                name='description'
                value={communityData.description}
                onChange={handleChange}
                rows='4'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                placeholder='Describe your community, its purpose, and what members can expect...'
                required
              />
            </div>

            {/* Group Link */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Link className='inline w-4 h-4 mr-2' />
                Group Link (WhatsApp/Telegram/Discord)
              </label>
              <input
                type='url'
                name='groupLink'
                value={communityData.groupLink}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                placeholder='https://chat.whatsapp.com/...'
              />
            </div>

            {/* Next Hangout */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Calendar className='inline w-4 h-4 mr-2' />
                Next Hangout/Event
              </label>
              <input
                type='text'
                name='nextHangout'
                value={communityData.nextHangout}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                placeholder='e.g., Coffee Meetup - Dec 15, 3 PM at Central Park'
              />
            </div>

            {/* Tags */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-4'>
                <Hash className='inline w-4 h-4 mr-2' />
                Tags ({communityData.tags.length} selected)
              </label>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type='button'
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      communityData.tags.includes(tag)
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end space-x-4'>
              <button
                type='button'
                onClick={() => navigate("/home")}
                className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5'
              >
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCommunityPage;
