const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        default: null,
        min: 16,
        max: 100,
    },
    college: {
        type: String,
        default: "",
    },
    graduationYear: {
        type: Number,
        default: null,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "",
    },
    profilePicture: {
        type: String,
        default: null,
    },
    banner: {
        type: String,
        default: null,
    },
    interests: {
        type: [String],
        default: [],
    },
    location: {
        country: String,
        state: String,
        city: String,
    },
    joinedCommunities: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Community",
        default: [],
    },
    createdCommunities: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Community",
        default: [],
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

const User = mongoose.model("User", UserSchema);

module.exports = User;