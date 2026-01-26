const Community = require('../models/communites');
const User = require('../models/user');
const mongoose = require('mongoose');
const { uploadImage, deleteImage, base64ToBuffer } = require('../utils/supabaseStorage');

// Create a new community
exports.createCommunity = async (req, res) => {
    try {
        const userId = req.userId;
        console.log('====== CREATE COMMUNITY START ======');
        console.log('Creating community with userId:', userId, 'Type:', typeof userId);
        
        const {
            name,
            description,
            category,
            tags,
            profilePicture,
            banner,
            galleryImages,
            groupLink,
            nextHangout
        } = req.body;

        // Validate required fields
        if (!name || !description || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name, description, and category are required'
            });
        }

        let profilePictureUrl = null;
        let bannerUrl = null;
        const galleryUrls = [];

        // Upload profile picture if provided
        if (profilePicture && typeof profilePicture === 'string' && profilePicture.startsWith('data:image')) {
            try {
                const buffer = base64ToBuffer(profilePicture);
                const fileName = `community-profile-${Date.now()}.jpg`;
                profilePictureUrl = await uploadImage(buffer, fileName, 'communities');
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }

        // Upload banner if provided
        if (banner && typeof banner === 'string' && banner.startsWith('data:image')) {
            try {
                const buffer = base64ToBuffer(banner);
                const fileName = `community-banner-${Date.now()}.jpg`;
                bannerUrl = await uploadImage(buffer, fileName, 'communities');
            } catch (error) {
                console.error('Error uploading banner:', error);
            }
        }

        // Upload gallery images if provided
        if (galleryImages && Array.isArray(galleryImages)) {
            for (let i = 0; i < galleryImages.length; i++) {
                if (typeof galleryImages[i] === 'string' && galleryImages[i].startsWith('data:image')) {
                    try {
                        const buffer = base64ToBuffer(galleryImages[i]);
                        const fileName = `community-gallery-${Date.now()}-${i}.jpg`;
                        const url = await uploadImage(buffer, fileName, 'communities');
                        galleryUrls.push(url);
                    } catch (error) {
                        console.error(`Error uploading gallery image ${i}:`, error);
                    }
                }
            }
        }

        // Create new community
        const userObjectId = new mongoose.Types.ObjectId(userId);
        console.log('Converting userId to ObjectId:', userObjectId);
        
        const newCommunity = new Community({
            name,
            description,
            category,
            tags: tags || [],
            createdBy: userObjectId,
            members: [userObjectId],
            profilePicture: profilePictureUrl,
            banner: bannerUrl,
            galleryImages: galleryUrls,
            groupLink: groupLink || null,
            nextHangout: nextHangout || null,
            reviews: [],
            ratings: 0,
            createdAt: new Date()
        });

        await newCommunity.save();
        console.log('Community created with ID:', newCommunity._id);

        // Add community to user's createdCommunities and joinedCommunities
        console.log('Updating user', userObjectId, 'with community', newCommunity._id);
        
        const userUpdate = await User.findByIdAndUpdate(
            userObjectId,
            { 
                $push: { 
                    createdCommunities: newCommunity._id,
                    joinedCommunities: newCommunity._id
                } 
            },
            { new: true }
        );

        if (!userUpdate) {
            console.error('Failed to update user with community - User not found');
            console.error('Attempted to find and update user with ID:', userObjectId);
            
            // Try to verify the user exists
            const userExists = await User.findById(userObjectId);
            if (!userExists) {
                console.error('User does not exist in database');
            } else {
                console.log('User exists but update failed. User:', userExists._id, userExists.email);
            }
        } else {
            console.log('User updated successfully');
            console.log('  User ID:', userUpdate._id);
            console.log('  createdCommunities count:', userUpdate.createdCommunities.length);
            console.log('  joinedCommunities count:', userUpdate.joinedCommunities.length);
            console.log('  createdCommunities:', userUpdate.createdCommunities);
            console.log('  joinedCommunities:', userUpdate.joinedCommunities);
        }
        console.log('====== CREATE COMMUNITY END - Returning success ======');

        return res.status(201).json({
            success: true,
            message: 'Community created successfully',
            community: newCommunity
        });
    } catch (error) {
        console.error('Create community error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error creating community',
            error: error.message
        });
    }
};

// Get community details
exports.getCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;

        const community = await Community.findById(communityId)
            .populate('createdBy', '_id name profilePicture')
            .populate('reviews');

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Convert members array to strings for consistent comparison
        const communityData = community.toObject();
        if (communityData.members) {
            communityData.members = communityData.members.map(id => id.toString());
        }
        
        // Ensure createdBy has an id field (map _id to id)
        if (communityData.createdBy && communityData.createdBy._id) {
            communityData.createdBy.id = communityData.createdBy._id.toString();
        }

        return res.status(200).json({
            success: true,
            community: communityData
        });
    } catch (error) {
        console.error('Get community error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching community',
            error: error.message
        });
    }
};

// Get all communities
exports.getAllCommunities = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const communities = await Community.find(query)
            .populate('createdBy', 'name profilePicture')
            .select('-reviews');

        return res.status(200).json({
            success: true,
            communities
        });
    } catch (error) {
        console.error('Get all communities error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching communities',
            error: error.message
        });
    }
};

// Get similar communities by category
exports.getSimilarCommunities = async (req, res) => {
    try {
        const { communityId } = req.params;
        const { limit = 3 } = req.query;

        // Get the current community to find its category
        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Find other communities in the same category, excluding the current one
        const similarCommunities = await Community.find({
            category: community.category,
            _id: { $ne: communityId }
        })
            .populate('createdBy', '_id name profilePicture')
            .select('-reviews')
            .limit(parseInt(limit));

        // Format the response to include id for createdBy
        const formattedCommunities = similarCommunities.map(comm => {
            const commData = comm.toObject();
            if (commData.createdBy && commData.createdBy._id) {
                commData.createdBy.id = commData.createdBy._id.toString();
            }
            if (commData.members) {
                commData.members = commData.members.map(id => id.toString());
            }
            return commData;
        });

        return res.status(200).json({
            success: true,
            communities: formattedCommunities,
            count: formattedCommunities.length
        });
    } catch (error) {
        console.error('Get similar communities error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching similar communities',
            error: error.message
        });
    }
};

// Update community
exports.updateCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.userId;
        const {
            name,
            description,
            category,
            tags,
            profilePicture,
            banner,
            groupLink,
            nextHangout
        } = req.body;

        // Get current community
        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Check if user is the creator
        if (community.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this community'
            });
        }

        // Update profile picture if provided
        if (profilePicture && typeof profilePicture === 'string' && profilePicture.startsWith('data:image')) {
            try {
                const oldPictureUrl = community.profilePicture;
                const buffer = base64ToBuffer(profilePicture);
                const fileName = `community-profile-${Date.now()}.jpg`;
                community.profilePicture = await uploadImage(buffer, fileName, 'communities');

                // Delete old profile picture if it exists
                if (oldPictureUrl) {
                    await deleteImage(oldPictureUrl);
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }

        // Update banner if provided
        if (banner && typeof banner === 'string' && banner.startsWith('data:image')) {
            try {
                const oldBannerUrl = community.banner;
                const buffer = base64ToBuffer(banner);
                const fileName = `community-banner-${Date.now()}.jpg`;
                community.banner = await uploadImage(buffer, fileName, 'communities');

                // Delete old banner if it exists
                if (oldBannerUrl) {
                    await deleteImage(oldBannerUrl);
                }
            } catch (error) {
                console.error('Error uploading banner:', error);
            }
        }

        // Update other fields
        if (name) community.name = name;
        if (description) community.description = description;
        if (category) community.category = category;
        if (tags) community.tags = tags;
        if (groupLink !== undefined) community.groupLink = groupLink;
        if (nextHangout !== undefined) community.nextHangout = nextHangout;

        await community.save();

        return res.status(200).json({
            success: true,
            message: 'Community updated successfully',
            community
        });
    } catch (error) {
        console.error('Update community error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error updating community',
            error: error.message
        });
    }
};

// Delete community
exports.deleteCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.userId;

        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Check if user is the creator
        if (community.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this community'
            });
        }

        // Delete images from Supabase
        if (community.profilePicture) {
            await deleteImage(community.profilePicture);
        }
        if (community.banner) {
            await deleteImage(community.banner);
        }
        if (community.galleryImages && community.galleryImages.length > 0) {
            for (const imageUrl of community.galleryImages) {
                await deleteImage(imageUrl);
            }
        }

        // Remove community from user's createdCommunities (convert userId string to ObjectId for query)
        const userObjectId = new mongoose.Types.ObjectId(userId);
        await User.findByIdAndUpdate(
            userObjectId,
            { $pull: { createdCommunities: communityId } }
        );

        // Remove community from all members' joinedCommunities
        await User.updateMany(
            { joinedCommunities: communityId },
            { $pull: { joinedCommunities: communityId } }
        );

        // Delete community
        await Community.findByIdAndDelete(communityId);

        return res.status(200).json({
            success: true,
            message: 'Community deleted successfully'
        });
    } catch (error) {
        console.error('Delete community error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error deleting community',
            error: error.message
        });
    }
};

// Join community
exports.joinCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.userId;

        console.log(`Join community: communityId=${communityId}, userId=${userId}`);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Check if already a member (compare as strings for ObjectId compatibility)
        const isMember = community.members.some(id => id.toString() === userId.toString());
        if (isMember) {
            return res.status(400).json({
                success: false,
                message: 'You are already a member of this community'
            });
        }

        // Add user to community members
        community.members.push(userId);
        await community.save();

        // Add community to user's joinedCommunities (convert userId string to ObjectId for query)
        const userObjectId = new mongoose.Types.ObjectId(userId);
        await User.findByIdAndUpdate(
            userObjectId,
            { $push: { joinedCommunities: communityId } }
        );

        // Fetch updated community with formatted data
        const updatedCommunity = await Community.findById(communityId)
            .populate('createdBy', 'name profilePicture')
            .populate('reviews');
        
        const communityData = updatedCommunity.toObject();
        if (communityData.members) {
            communityData.members = communityData.members.map(id => id.toString());
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully joined community',
            community: communityData
        });
    } catch (error) {
        console.error('Join community error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error joining community',
            error: error.message
        });
    }
};

// Leave community
exports.leaveCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.userId;

        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Check if user is a member (compare as strings for ObjectId compatibility)
        const isMember = community.members.some(id => id.toString() === userId.toString());
        if (!isMember) {
            return res.status(400).json({
                success: false,
                message: 'You are not a member of this community'
            });
        }

        // Remove user from community members
        community.members = community.members.filter(
            id => id.toString() !== userId.toString()
        );
        await community.save();

        // Remove community from user's joinedCommunities (convert userId string to ObjectId for query)
        const userObjectId = new mongoose.Types.ObjectId(userId);
        await User.findByIdAndUpdate(
            userObjectId,
            { $pull: { joinedCommunities: communityId } }
        );

        // Fetch updated community with formatted data
        const updatedCommunity = await Community.findById(communityId)
            .populate('createdBy', 'name profilePicture')
            .populate('reviews');
        
        const communityData = updatedCommunity.toObject();
        if (communityData.members) {
            communityData.members = communityData.members.map(id => id.toString());
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully left community',
            community: communityData
        });
    } catch (error) {
        console.error('Leave community error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error leaving community',
            error: error.message
        });
    }
};

// Add a review to a community
exports.addReview = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.userId;
        const { rating, comment } = req.body;

        // Validate required fields
        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Rating and comment are required'
            });
        }

        // Validate rating is between 1-5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Check if user is a member (compare as strings for ObjectId compatibility)
        const isMember = community.members.some(id => id.toString() === userId.toString());
        if (!isMember) {
            return res.status(400).json({
                success: false,
                message: 'Only members can leave reviews'
            });
        }

        // Get user details
        const user = await User.findById(userId);

        // Create review object
        const review = {
            user: userId,
            userName: user.name || 'Anonymous',
            avatar: user.profilePicture || null,
            rating,
            comment,
            createdAt: new Date()
        };

        // Add review to community
        if (!community.reviews) {
            community.reviews = [];
        }
        community.reviews.push(review);

        // Recalculate average rating
        const totalRating = community.reviews.reduce((sum, r) => sum + r.rating, 0);
        community.ratings = totalRating / community.reviews.length;

        await community.save();

        // Populate reviews and convert members to strings for consistent response
        const updatedCommunity = await Community.findById(communityId)
            .populate('createdBy', 'name profilePicture')
            .populate('reviews');
        
        const communityData = updatedCommunity.toObject();
        if (communityData.members) {
            communityData.members = communityData.members.map(id => id.toString());
        }

        return res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review,
            community: communityData
        });
    } catch (error) {
        console.error('Add review error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error adding review',
            error: error.message
        });
    }
};

