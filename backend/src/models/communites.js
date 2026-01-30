const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userName: String,
    avatar: String,
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const CommunitySchema = mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: { 
        type: String,
        required: true,
        enum: [
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
        ],
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    banner: {
        type: String,
        default: null,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    galleryImages: {
        type: [String],
        default: [],
    },
    tags: {
        type: [String],
        default: [],
    },
    groupLink: {
        type: String,
        default: null,
    },
    nextHangout: {
        type: Date,
        default: null,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviews: [ReviewSchema],
    totalReviews: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Community = mongoose.model("Community", CommunitySchema);

module.exports = Community;
