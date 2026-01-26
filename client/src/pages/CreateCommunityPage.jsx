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
import { communityAPI } from "../services/api";

function CreateCommunityPage({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [communityData, setCommunityData] = useState({
    name: "",
    description: "",
    category: "",
    banner: null,
    profilePicture: null,
    tags: [],
    groupLink: "",
    nextHangout: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!communityData.name || !communityData.description || !communityData.category) {
      setError("Name, description, and category are required");
      setLoading(false);
      return;
    }

    if (communityData.tags.length === 0) {
      setError("Please select at least one tag");
      setLoading(false);
      return;
    }

    try {
      const response = await communityAPI.createCommunity({
        name: communityData.name,
        description: communityData.description,
        category: communityData.category,
        tags: communityData.tags,
        profilePicture: communityData.profilePicture,
        banner: communityData.banner,
        groupLink: communityData.groupLink || null,
        nextHangout: communityData.nextHangout || null,
      });

      if (response.success) {
        navigate("/home");
      } else {
        setError(response.message || "Failed to create community");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <div className='flex items-center justify-between py-4 gap-2'>
            <button
              onClick={() => navigate("/home")}
              className='flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors min-w-fit'
            >
              <ArrowLeft className='w-5 h-5' />
              <span className='hidden sm:inline'>Back to Home</span>
              <span className='inline sm:hidden'>Back</span>
            </button>
            <h1 className='text-lg sm:text-xl font-semibold text-gray-900'>
              Create Community
            </h1>
            <div className='w-16 sm:w-20'></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8'>
          {error && (
            <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-700 text-sm'>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className='space-y-8'>
            {/* Banner Upload */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3 sm:mb-4'>
                Community Banner
              </label>
              <div className='relative'>
                <div className='w-full h-40 sm:h-48 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center overflow-hidden'>
                  {communityData.banner ? (
                    <img
                      src={communityData.banner}
                      alt='Banner'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='text-center'>
                      <Camera className='w-10 sm:w-12 h-10 sm:h-12 text-gray-400 mx-auto mb-2' />
                      <p className='text-gray-500 text-sm sm:text-base'>Upload a banner image</p>
                    </div>
                  )}
                </div>
                <label className='absolute bottom-4 right-4 bg-purple-500 text-white p-2 sm:p-3 rounded-full cursor-pointer hover:bg-purple-600 transition-colors'>
                  <Camera className='w-4 sm:w-5 h-4 sm:h-5' />
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload("banner")}
                    disabled={loading}
                    className='hidden'
                  />
                </label>
              </div>
            </div>

            {/* Profile Picture and Basic Info */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3 sm:mb-4'>
                  Community Logo
                </label>
                <div className='relative'>
                  <div className='w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mx-auto sm:mx-0'>
                    {communityData.profilePicture ? (
                      <img
                        src={communityData.profilePicture}
                        alt='Logo'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <Users className='w-10 sm:w-12 h-10 sm:h-12 text-gray-400' />
                    )}
                  </div>
                  <label className='absolute bottom-0 right-0 bg-purple-500 text-white p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors'>
                    <Camera className='w-3 sm:w-4 h-3 sm:h-4' />
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload("profilePicture")}
                      disabled={loading}
                      className='hidden'
                    />
                  </label>
                </div>
              </div>

              <div className='sm:col-span-2 space-y-4 sm:space-y-6'>
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
                    disabled={loading}
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
                    disabled={loading}
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
                disabled={loading}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                placeholder='Describe your community, its purpose, and what members can expect...'
                required
              />
            </div>

            {/* Group Link */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Link className='inline w-4 h-4 mr-2' />
                WhatsApp/Group Link (Optional)
              </label>
              <input
                type='url'
                name='groupLink'
                value={communityData.groupLink}
                onChange={handleChange}
                disabled={loading}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                placeholder='https://chat.whatsapp.com/... or your group link'
              />
            </div>

            {/* Next Hangout Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Calendar className='inline w-4 h-4 mr-2' />
                Next Hangout Date & Time (Optional)
              </label>
              <input
                type='datetime-local'
                name='nextHangout'
                value={communityData.nextHangout}
                onChange={handleChange}
                disabled={loading}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
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
                    disabled={loading}
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
            <div className='flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end'>
              <button
                type='button'
                onClick={() => navigate("/home")}
                disabled={loading}
                className='w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading}
                className='w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? "Creating..." : "Create Community"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCommunityPage;
