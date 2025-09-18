import React, { useState } from "react";
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

function HomePage({ user }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Dummy communities data
  const communities = [
    {
      id: 1,
      name: "Tech Enthusiasts LA",
      description:
        "Connect with fellow tech lovers, share projects, and attend meetups",
      members: 1247,
      category: "Technology",
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      tags: ["Programming", "AI", "Startups"],
      nextEvent: "Hackathon - Dec 15",
    },
    {
      id: 2,
      name: "Photography Club",
      description: "Capture moments, share techniques, and explore LA together",
      members: 892,
      category: "Arts",
      image:
        "https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      tags: ["Portrait", "Street Photography", "Editing"],
      nextEvent: "Photo Walk - Dec 12",
    },
    {
      id: 3,
      name: "Fitness Warriors",
      description:
        "Stay motivated, workout together, and achieve your fitness goals",
      members: 2156,
      category: "Fitness",
      image:
        "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      tags: ["Gym", "Running", "Nutrition"],
      nextEvent: "Group Run - Dec 10",
    },
    {
      id: 4,
      name: "Book Lovers Society",
      description:
        "Discuss literature, share recommendations, and attend book signings",
      members: 634,
      category: "Literature",
      image:
        "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      tags: ["Fiction", "Non-fiction", "Poetry"],
      nextEvent: "Book Discussion - Dec 14",
    },
    {
      id: 5,
      name: "Gaming Squad",
      description:
        "From casual mobile games to competitive esports tournaments",
      members: 1823,
      category: "Gaming",
      image:
        "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      tags: ["PC Gaming", "Console", "Mobile"],
      nextEvent: "Tournament - Dec 16",
    },
    {
      id: 6,
      name: "Music Makers",
      description:
        "Musicians, singers, and music enthusiasts creating together",
      members: 967,
      category: "Music",
      image:
        "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      tags: ["Indie", "Rock", "Electronic"],
      nextEvent: "Jam Session - Dec 13",
    },
  ];

  const categories = [
    "all",
    "Technology",
    "Arts",
    "Fitness",
    "Literature",
    "Gaming",
    "Music",
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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              onClick={() => navigate(`/community/${community.id}`)}
              className='bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1'
            >
              <div className='relative'>
                <img
                  src={community.image}
                  alt={community.name}
                  className='w-full h-48 object-cover rounded-t-2xl'
                />
                <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-700'>
                  {community.category}
                </div>
              </div>

              <div className='p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {community.name}
                </h3>
                <p className='text-gray-600 mb-4 line-clamp-2'>
                  {community.description}
                </p>

                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center space-x-1 text-gray-500'>
                    <Users className='w-4 h-4' />
                    <span className='text-sm font-medium'>
                      {community.members.toLocaleString()} members
                    </span>
                  </div>
                  <div className='flex items-center space-x-1 text-purple-600'>
                    <MapPin className='w-4 h-4' />
                    <span className='text-sm font-medium'>
                      {community.nextEvent}
                    </span>
                  </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                  {community.tags.map((tag) => (
                    <span
                      key={tag}
                      className='px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
              No communities found
            </h3>
            <p className='text-gray-600 mb-4'>
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => navigate("/create-community")}
              className='bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200'
            >
              Create Your Own Community
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
