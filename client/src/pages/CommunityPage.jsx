import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  MapPin,
  Link,
  Calendar,
  Star,
  MessageCircle,
  Share,
  Heart,
  ExternalLink,
  Image,
  Send,
  MoreHorizontal,
} from "lucide-react";

function CommunityPage({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isJoined, setIsJoined] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);

  // Dummy community data based on ID
  const communityData = {
    1: {
      name: "Tech Enthusiasts LA",
      description:
        "A vibrant community of tech lovers, developers, and innovators in Los Angeles. We organize weekly meetups, hackathons, and networking events. Whether you're a beginner or an expert, everyone is welcome!",
      category: "Technology",
      members: 1247,
      banner:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&fit=crop",
      profilePicture:
        "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      groupLink: "https://chat.whatsapp.com/tech-enthusiasts-la",
      nextHangout: "Hackathon - Dec 15, 2024 at UCLA Campus",
      tags: ["Programming", "AI", "Startups", "Networking"],
      rating: 4.8,
      totalReviews: 156,
    },
    2: {
      name: "Photography Club",
      description:
        "Capture moments, share techniques, and explore LA together. From street photography to portraits, we cover all genres. Join us for photo walks, workshops, and exhibitions.",
      category: "Arts",
      members: 892,
      banner:
        "https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&fit=crop",
      profilePicture:
        "https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      groupLink: "https://t.me/photography_club_la",
      nextHangout: "Photo Walk - Dec 12, 2024 at Venice Beach",
      tags: ["Portrait", "Street Photography", "Editing"],
      rating: 4.9,
      totalReviews: 89,
    },
  };

  const community = communityData[id] || communityData[1];

  const galleryImages = [
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
  ];

  const reviews = [
    {
      id: 1,
      user: "Sarah Chen",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
      rating: 5,
      comment:
        "Amazing community! I've learned so much and made great friends. The events are well-organized and everyone is super welcoming.",
      date: "2 days ago",
    },
    {
      id: 2,
      user: "Marcus Johnson",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
      rating: 5,
      comment:
        "Great place to network and collaborate on projects. The hackathons are intense but so much fun!",
      date: "1 week ago",
    },
    {
      id: 3,
      user: "Emma Rodriguez",
      avatar:
        "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
      rating: 4,
      comment:
        "Love the diversity of topics covered. From beginner workshops to advanced discussions, there's something for everyone.",
      date: "2 weeks ago",
    },
  ];

  const handleJoinCommunity = () => {
    setIsJoined(!isJoined);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Simulate review submission
    console.log("Submitting review:", { rating, comment: newReview });
    setNewReview("");
    setRating(5);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-4'>
            <button
              onClick={() => navigate("/home")}
              className='flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
              <span>Back to Communities</span>
            </button>
            <div className='flex items-center space-x-3'>
              <button className='p-2 text-gray-600 hover:text-purple-600 transition-colors'>
                <Share className='w-5 h-5' />
              </button>
              <button className='p-2 text-gray-600 hover:text-red-500 transition-colors'>
                <Heart className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Banner and Profile Section */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8'>
          {/* Banner */}
          <div className='relative h-64 bg-gradient-to-r from-purple-400 to-blue-400'>
            <img
              src={community.banner}
              alt={community.name}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-black/30'></div>
          </div>

          {/* Community Info */}
          <div className='relative px-8 pb-8'>
            <div className='flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16 relative z-10'>
              {/* Profile Picture */}
              <div className='w-32 h-32 bg-white rounded-full p-2 shadow-lg mb-4 md:mb-0'>
                <img
                  src={community.profilePicture}
                  alt={community.name}
                  className='w-full h-full rounded-full object-cover'
                />
              </div>

              {/* Community Details */}
              <div className='flex-1'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                  <div>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                      {community.name}
                    </h1>
                    <div className='flex flex-wrap items-center gap-4 text-gray-600 mb-4'>
                      <div className='flex items-center space-x-1'>
                        <Users className='w-4 h-4' />
                        <span>
                          {community.members.toLocaleString()} members
                        </span>
                      </div>
                      <div className='flex items-center space-x-1'>
                        <Star className='w-4 h-4 text-yellow-400 fill-current' />
                        <span>
                          {community.rating} ({community.totalReviews} reviews)
                        </span>
                      </div>
                      <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium'>
                        {community.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleJoinCommunity}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isJoined
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                    }`}
                  >
                    {isJoined ? "Joined ✓" : "Join Community"}
                  </button>
                </div>

                {/* Tags */}
                <div className='flex flex-wrap gap-2 mb-4'>
                  {community.tags.map((tag) => (
                    <span
                      key={tag}
                      className='px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className='text-gray-700 leading-relaxed mb-6'>
                  {community.description}
                </p>

                {/* Action Buttons */}
                <div className='flex flex-wrap gap-4'>
                  <a
                    href={community.groupLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors'
                  >
                    <MessageCircle className='w-4 h-4' />
                    <span>Join Group Chat</span>
                    <ExternalLink className='w-4 h-4' />
                  </a>
                  <div className='flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg'>
                    <Calendar className='w-4 h-4' />
                    <span>{community.nextHangout}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Photo Gallery */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
                  <Image className='w-5 h-5 mr-2' />
                  Photo Gallery
                </h2>
                <button className='text-purple-600 hover:text-purple-700 font-medium'>
                  View All
                </button>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className='aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer'
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                Reviews & Feedback
              </h2>

              {/* Add Review Form */}
              {isJoined && (
                <form
                  onSubmit={handleSubmitReview}
                  className='mb-8 p-4 bg-gray-50 rounded-lg'
                >
                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Your Rating
                    </label>
                    <div className='flex space-x-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type='button'
                          onClick={() => setRating(star)}
                          className={`w-6 h-6 ${
                            star <= rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        >
                          <Star className='w-full h-full' />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className='mb-4'>
                    <textarea
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      placeholder='Share your experience with this community...'
                      rows='3'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    />
                  </div>
                  <button
                    type='submit'
                    className='flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors'
                  >
                    <Send className='w-4 h-4' />
                    <span>Submit Review</span>
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className='space-y-6'>
                {reviews.map((review) => (
                  <div key={review.id} className='flex space-x-4'>
                    <img
                      src={review.avatar}
                      alt={review.user}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-2'>
                        <div>
                          <h4 className='font-medium text-gray-900'>
                            {review.user}
                          </h4>
                          <div className='flex items-center space-x-2'>
                            <div className='flex space-x-1'>
                              {[...Array(review.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className='w-4 h-4 text-yellow-400 fill-current'
                                />
                              ))}
                            </div>
                            <span className='text-sm text-gray-500'>
                              {review.date}
                            </span>
                          </div>
                        </div>
                        <button className='text-gray-400 hover:text-gray-600'>
                          <MoreHorizontal className='w-4 h-4' />
                        </button>
                      </div>
                      <p className='text-gray-700'>{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Community Stats */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Community Stats
              </h3>
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Total Members</span>
                  <span className='font-semibold'>
                    {community.members.toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Average Rating</span>
                  <span className='font-semibold'>{community.rating}/5</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Total Reviews</span>
                  <span className='font-semibold'>
                    {community.totalReviews}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Category</span>
                  <span className='font-semibold'>{community.category}</span>
                </div>
              </div>
            </div>

            {/* Similar Communities */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Similar Communities
              </h3>
              <div className='space-y-3'>
                {[
                  { name: "AI & Machine Learning", members: "892" },
                  { name: "Web Development", members: "1.2K" },
                  { name: "Startup Founders", members: "654" },
                ].map((similar, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
                  >
                    <div>
                      <h4 className='font-medium text-gray-900'>
                        {similar.name}
                      </h4>
                      <p className='text-sm text-gray-600'>
                        {similar.members} members
                      </p>
                    </div>
                    <button className='text-purple-600 hover:text-purple-700 text-sm font-medium'>
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
