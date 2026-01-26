import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Users,
  Link,
  Hash,
  Calendar,
} from "lucide-react";
import { communityAPI } from "../services/api";

function EditCommunityPage({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [community, setCommunity] = useState(null);
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

  // Fetch community data
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await communityAPI.getCommunity(id);

        if (response.success) {
          const comm = response.community;
          
          // Check if user is the creator
          if (comm.createdBy?.id !== user?.id) {
            setError("You do not have permission to edit this community");
            return;
          }

          setCommunity(comm);
          setCommunityData({
            name: comm.name || "",
            description: comm.description || "",
            category: comm.category || "",
            tags: comm.tags || [],
            profilePicture: comm.profilePicture,
            banner: comm.banner,
            groupLink: comm.groupLink || "",
            nextHangout: comm.nextHangout || "",
          });
        } else {
          setError(response.message || "Failed to load community");
        }
      } catch (err) {
        console.error("Error fetching community:", err);
        setError("An error occurred while loading the community");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id, user?.id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!communityData.name || !communityData.description || !communityData.category) {
      setError("Name, description, and category are required");
      setSubmitting(false);
      return;
    }

    try {
      const response = await communityAPI.updateCommunity(id, {
        name: communityData.name,
        description: communityData.description,
        category: communityData.category,
        tags: communityData.tags,
        profilePicture: communityData.profilePicture,
        banner: communityData.banner,
        groupLink: communityData.groupLink,
        nextHangout: communityData.nextHangout,
      });

      if (response.success) {
        navigate(`/community/${id}`);
      } else {
        setError(response.message || "Failed to update community");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block'>
            <div className='w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin'></div>
          </div>
          <p className='text-gray-600 mt-4'>Loading community...</p>
        </div>
      </div>
    );
  }

  if (error && !community) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <header className='bg-white shadow-sm border-b border-gray-200'>
          <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
            <button
              onClick={() => navigate("/home")}
              className='flex items-center space-x-2 text-gray-600 hover:text-purple-600'
            >
              <ArrowLeft className='w-5 h-5' />
              <span>Back to Home</span>
            </button>
          </div>
        </header>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
            <p className='text-red-700'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-4'>
            <button
              onClick={() => navigate(`/community/${id}`)}
              className='flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
              <span>Back to Community</span>
            </button>
            <h1 className='text-xl font-semibold text-gray-900'>
              Edit Community
            </h1>
            <div className='w-20'></div>
          </div>
        </div>
      </header>

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-700 text-sm'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-8'>
            {/* Banner */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-4'>
                Community Banner
              </label>
              <div className='relative'>
                <div className='h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden'>
                  {communityData.banner ? (
                    <img
                      src={communityData.banner}
                      alt='Banner'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='text-center'>
                      <Camera className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                      <p className='text-gray-500'>No banner uploaded</p>
                    </div>
                  )}
                </div>
                <label className='absolute bottom-4 right-4 bg-purple-500 text-white p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors'>
                  <Camera className='w-4 h-4' />
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
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
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

            {/* Tags */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-4'>
                <Hash className='inline w-4 h-4 mr-2' />
                Tags (Select at least one)
              </label>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type='button'
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      communityData.tags.includes(tag)
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {communityData.tags.length === 0 && (
                <p className='text-red-500 text-sm mt-2'>
                  Please select at least one tag
                </p>
              )}
            </div>

            {/* WhatsApp Group Link */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Link className='inline w-4 h-4 mr-2' />
                WhatsApp/Telegram/Discord Group Link
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

            {/* Next Hangout Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Calendar className='inline w-4 h-4 mr-2' />
                Next Hangout / Event Date
              </label>
              <input
                type='datetime-local'
                name='nextHangout'
                value={communityData.nextHangout}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              />
            </div>

            {/* Submit Buttons */}
            <div className='flex gap-4 justify-end pt-6 border-t'>
              <button
                type='button'
                onClick={() => navigate(`/community/${id}`)}
                className='px-6 py-3 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={submitting}
                className='px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCommunityPage;
