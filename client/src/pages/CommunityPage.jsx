import React, { useState, useEffect } from "react";
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
  ExternalLink,
  Image,
  Send,
  MoreHorizontal,
  Trash,
  Edit,
} from "lucide-react";
import { communityAPI, authAPI } from "../services/api";

function CommunityPage({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isJoined, setIsJoined] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [community, setCommunity] = useState(null);
  const [similarCommunities, setSimilarCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch community data
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        setError("");
        setIsJoined(false); // Reset join status when fetching new community
        const response = await communityAPI.getCommunity(id);
        
        if (response.success) {
          setCommunity(response.community);
          // Check if user is already a member (compare IDs as strings)
          if (response.community.members?.some(memberId => memberId === user?.id)) {
            setIsJoined(true);
          }
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



  // Fetch similar communities
  useEffect(() => {
    const fetchSimilarCommunities = async () => {
      try {
        const response = await communityAPI.getSimilarCommunities(id, 3);
        if (response.success) {
          setSimilarCommunities(response.communities || []);
        }
      } catch (err) {
        console.error("Error fetching similar communities:", err);
      }
    };

    if (id) {
      fetchSimilarCommunities();
    }
  }, [id]);

  const handleJoinCommunity = async () => {
    try {
      const response = await communityAPI.joinCommunity(id);
      if (response.success) {
        setIsJoined(true);
        setCommunity(response.community);
      } else {
        console.error("Join community failed:", response.message);
        setError(response.message || "Failed to join community");
      }
    } catch (err) {
      console.error("Error joining community:", err);
      setError("An error occurred while joining the community");
    }
  };

  const handleLeaveCommunity = async () => {
    if (!window.confirm("Are you sure you want to leave this community?")) {
      return;
    }
    try {
      const response = await communityAPI.leaveCommunity(id);
      if (response.success) {
        setIsJoined(false);
        setCommunity(response.community);
      } else {
        console.error("Leave community failed:", response.message);
        setError(response.message || "Failed to leave community");
      }
    } catch (err) {
      console.error("Error leaving community:", err);
      setError("An error occurred while leaving the community");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const response = await communityAPI.addReview(id, rating, newReview);
      if (response.success) {
        // Update community with the new review
        setCommunity(response.community);
        setNewReview("");
        setRating(5);
      } else {
        console.error("Error submitting review:", response.message);
        setError(response.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("An error occurred while submitting your review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/community/${id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopyNotification(true);
      setTimeout(() => setCopyNotification(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };



  const handleDeleteCommunity = async () => {
    if (!window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await communityAPI.deleteCommunity(id);
      if (response.success) {
        navigate("/home");
      } else {
        setError(response.message || "Failed to delete community");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error deleting community:", err);
      setError("An error occurred while deleting the community");
      setLoading(false);
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

  if (error || !community) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <header className='bg-white shadow-sm border-b border-gray-200'>
          <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
            <button
              onClick={() => navigate("/home")}
              className='flex items-center space-x-2 text-gray-600 hover:text-purple-600'
            >
              <ArrowLeft className='w-5 h-5' />
              <span>Back to Communities</span>
            </button>
          </div>
        </header>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
            <p className='text-red-700 font-medium mb-4'>{error || "Community not found"}</p>
            <button
              onClick={() => navigate("/home")}
              className='text-red-600 hover:text-red-700 font-medium'
            >
              Go back to communities
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-4 gap-2'>
            <button
              onClick={() => navigate("/home")}
              className='flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors min-w-fit'
            >
              <ArrowLeft className='w-5 h-5 flex-shrink-0' />
              <span className='hidden sm:inline'>Back to Communities</span>
              <span className='inline sm:hidden'>Back</span>
            </button>
            <div className='flex items-center space-x-1 sm:space-x-3'>
              <button 
                onClick={handleCopyLink}
                className='p-2 text-gray-600 hover:text-purple-600 transition-colors relative'
                title='Copy community link'
              >
                <Share className='w-5 h-5' />
                {copyNotification && (
                  <div className='absolute top-full mt-2 right-0 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap'>
                    Copied!
                  </div>
                )}
              </button>
              {isJoined && community?.createdBy?.id !== user?.id && (
                <button
                  onClick={handleLeaveCommunity}
                  className='px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm'
                  title='Leave community'
                >
                  Leave
                </button>
              )}
              {community?.createdBy?.id === user?.id && (
                <>
                  <button
                    onClick={() => navigate(`/community/${id}/edit`)}
                    className='p-2 text-gray-600 hover:text-blue-600 transition-colors'
                    title='Edit community'
                  >
                    <Edit className='w-5 h-5' />
                  </button>
                  <button
                    onClick={handleDeleteCommunity}
                    className='p-2 text-gray-600 hover:text-red-600 transition-colors'
                    title='Delete community'
                  >
                    <Trash className='w-5 h-5' />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {error && (
          <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-700 text-sm'>{error}</p>
          </div>
        )}
        {/* Banner and Profile Section */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8'>
          {/* Banner */}
          <div className='relative h-64 bg-gradient-to-r from-purple-400 to-blue-400'>
            {community.banner ? (
              <img
                src={community.banner}
                alt={community.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center'>
                <Image className='w-16 h-16 text-gray-300' />
              </div>
            )}
            <div className='absolute inset-0 bg-black/30'></div>
          </div>

          {/* Community Info */}
          <div className='relative px-4 sm:px-8 pt-8 pb-8'>
            <div className='flex flex-col md:flex-row md:items-start md:space-x-6 relative z-10'>
              {/* Profile Picture */}
              <div className='w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full p-2 shadow-lg mb-4 md:mb-0 flex-shrink-0 mx-auto md:mx-0'>
                {community.profilePicture ? (
                  <img
                    src={community.profilePicture}
                    alt={community.name}
                    className='w-full h-full rounded-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold'>
                    {community.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Community Details */}
              <div className='flex-1 min-w-0 text-center md:text-left'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                  <div>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                      {community.name}
                    </h1>
                    <div className='flex flex-wrap items-center gap-4 text-gray-600 mb-4'>
                      <div className='flex items-center space-x-1'>
                        <Users className='w-4 h-4' />
                        <span>
                          {community.members?.length || 0} members
                        </span>
                      </div>
                      {community.ratings > 0 && (
                        <div className='flex items-center space-x-1'>
                          <Star className='w-4 h-4 text-yellow-400 fill-current' />
                          <span>
                            {community.ratings.toFixed(1)} ({community.totalReviews || 0} reviews)
                          </span>
                        </div>
                      )}
                      <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium'>
                        {community.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleJoinCommunity}
                    disabled={isJoined}
                    className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isJoined
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                    }`}
                  >
                    {isJoined ? "Joined ✓" : "Join Community"}
                  </button>
                </div>

                {/* Tags */}
                {community.tags && community.tags.length > 0 && (
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
                )}

                {/* Description */}
                <p className='text-gray-700 leading-relaxed mb-6'>
                  {community.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Photo Gallery */}
            {community.galleryImages && community.galleryImages.length > 0 && (
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
                    <Image className='w-5 h-5 mr-2' />
                    Photo Gallery
                  </h2>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                  {community.galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className='aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer'
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                          <Image className='w-8 h-8 text-gray-400' />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              {/* WhatsApp/Group Join and Hangout Date Buttons - Above Reviews */}
              {isJoined && (community.groupLink || community.nextHangout) && (
                <div className='flex flex-wrap gap-4 mb-8'>
                  {community.groupLink && (
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
                  )}
                  {community.nextHangout && (
                    <div className='flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg'>
                      <Calendar className='w-4 h-4' />
                      <span>Next Hangout: {new Date(community.nextHangout).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}

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
                    disabled={submittingReview}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      submittingReview
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    <Send className='w-4 h-4' />
                    <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className='space-y-6'>
                {community?.reviews && community.reviews.length > 0 ? (
                  community.reviews.map((review, index) => (
                    <div key={review._id || index} className='flex space-x-4'>
                      <div className='w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden'>
                        {review.avatar ? (
                          <img
                            src={review.avatar}
                            alt={review.userName}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center'>
                            {review.userName?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between mb-2'>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              {review.userName || "Anonymous"}
                            </h4>
                            <div className='flex items-center space-x-2'>
                              <div className='flex space-x-1'>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className='text-sm text-gray-500'>
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className='text-gray-700'>{review.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>No reviews yet. Be the first to review!</p>
                  </div>
                )}
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
                    {community.members?.length || 0}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Average Rating</span>
                  <span className='font-semibold'>
                    {community.reviews && community.reviews.length > 0
                      ? (community.reviews.reduce((sum, review) => sum + review.rating, 0) / community.reviews.length).toFixed(1)
                      : "N/A"}/5
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Total Reviews</span>
                  <span className='font-semibold'>
                    {community.reviews?.length || 0}
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
                {similarCommunities && similarCommunities.length > 0 ? (
                  similarCommunities.map((similar) => (
                    <div
                      key={similar._id}
                      className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
                      onClick={() => navigate(`/community/${similar._id}`)}
                    >
                      <div>
                        <h4 className='font-medium text-gray-900'>
                          {similar.name}
                        </h4>
                        <p className='text-sm text-gray-600'>
                          {similar.members?.length || 0} members
                        </p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/community/${similar._id}`);
                        }}
                        className='text-purple-600 hover:text-purple-700 text-sm font-medium'
                      >
                        View
                      </button>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-500 text-sm'>No similar communities found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
