import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Users,
  MapPin,
  Filter,
  User,
  Settings,
} from "lucide-react";
import { communityAPI } from "../services/api";

function HomePage({ user }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch communities on component mount or when filter changes
  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await communityAPI.getAllCommunities();
      
      if (response.success) {
        setCommunities(response.communities);
      } else {
        setError(response.message || "Failed to fetch communities");
        // Set empty array to show no communities
        setCommunities([]);
      }
    } catch (err) {
      console.error("Error fetching communities:", err);
      setError("An error occurred while fetching communities");
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "all",
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

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFilter =
      selectedFilter === "all" || community.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center'>
                <Users className='w-5 h-5 text-white' />
              </div>
              <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
                VibeIn
              </span>
            </div>

            <div className='flex items-center space-x-4'>
              <button
                onClick={() => navigate("/create-community")}
                className='bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2'
              >
                <Plus className='w-4 h-4' />
                <span>Create Community</span>
              </button>
              <button
                onClick={() => navigate("/profile")}
                className='p-2 text-gray-600 hover:text-purple-600 transition-colors'
              >
                <User className='w-6 h-6' />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Welcome back, {user?.name || "Student"}! 👋
          </h1>
          <p className='text-gray-600'>
            Discover communities in {user?.location?.city || "your city"}
          </p>
        </div>

        {/* Search and Filters */}
        <div className='mb-8 space-y-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search communities, interests, or activities...'
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            />
          </div>

          <div className='flex flex-wrap gap-2'>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedFilter === category
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category === "all" ? "All Categories" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className='text-center py-12'>
            <div className='inline-block'>
              <div className='w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin'></div>
            </div>
            <p className='text-gray-600 mt-4'>Loading communities...</p>
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
            <p className='text-red-700 font-medium mb-4'>{error}</p>
            <button
              onClick={fetchCommunities}
              className='text-red-600 hover:text-red-700 font-medium'
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredCommunities.map((community) => (
                <div
                  key={community._id}
                  onClick={() => navigate(`/community/${community._id}`)}
                  className='bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden'
                >
                  <div className='relative h-48 bg-gradient-to-r from-purple-200 to-blue-200'>
                    {community.banner ? (
                      <img
                        src={community.banner}
                        alt={community.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <div className='text-center'>
                          <Users className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                          <p className='text-gray-500 text-sm'>No banner</p>
                        </div>
                      </div>
                    )}
                    <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700'>
                      {community.category}
                    </div>
                  </div>

                  <div className='p-6'>
                    <div className='flex items-start gap-3 mb-3'>
                      {community.profilePicture ? (
                        <img
                          src={community.profilePicture}
                          alt={community.name}
                          className='w-10 h-10 rounded-full object-cover flex-shrink-0'
                        />
                      ) : (
                        <div className='w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0'>
                          {community.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900 line-clamp-1'>
                          {community.name}
                        </h3>
                        <p className='text-xs text-gray-500'>
                          Created by {community.createdBy?.name || 'Anonymous'}
                        </p>
                      </div>
                    </div>

                    <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                      {community.description}
                    </p>

                    <div className='flex items-center justify-between mb-4 text-sm'>
                      <div className='flex items-center space-x-1 text-gray-600'>
                        <Users className='w-4 h-4' />
                        <span className='font-medium'>
                          {community.members?.length || 0} members
                        </span>
                      </div>
                      {community.ratings > 0 && (
                        <div className='flex items-center space-x-1 text-yellow-500'>
                          <span>★</span>
                          <span className='font-medium'>
                            {community.ratings.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {community.tags && community.tags.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {community.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className='px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full'
                          >
                            {tag}
                          </span>
                        ))}
                        {community.tags.length > 3 && (
                          <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full'>
                            +{community.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredCommunities.length === 0 && (
              <div className='text-center py-12'>
                <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Search className='w-8 h-8 text-gray-400' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  {communities.length === 0 ? 'No communities yet' : 'No communities found'}
                </h3>
                <p className='text-gray-600 mb-4'>
                  {communities.length === 0 
                    ? 'Be the first to create a community!' 
                    : 'Try adjusting your search or filters'}
                </p>
                <button
                  onClick={() => navigate("/create-community")}
                  className='bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200'
                >
                  Create Your Own Community
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
