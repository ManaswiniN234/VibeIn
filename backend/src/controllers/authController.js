const User = require("../models/user");
const Community = require("../models/communites");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadImage, deleteImage, base64ToBuffer } = require("../utils/supabaseStorage");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_change_in_production";

// Hash password before saving
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare password with hash
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// Generate JWT token
const generateToken = (userId) => {
    // Ensure userId is a string for consistent JWT encoding
    return jwt.sign({ userId: userId.toString() }, JWT_SECRET, { expiresIn: "7d" });
};

// Sign Up Controller
exports.signup = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Validate input
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name: "",
            age: null,
            college: "",
            graduationYear: null,
            bio: "",
            interests: [],
            joinedCommunities: [],
            createdCommunities: [],
        });

        await newUser.save();

        // Generate token
        const token = generateToken(newUser._id);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during signup",
            error: error.message,
        });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate token
        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                age: user.age,
                college: user.college,
                bio: user.bio,
                interests: user.interests,
                profilePicture: user.profilePicture,
                banner: user.banner,
                location: user.location,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message,
        });
    }
};

// Get user profile (requires token)
exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId; // Set by auth middleware

        const user = await User.findById(userId)
            .select("-password")
            .populate("joinedCommunities", "name category members")
            .populate("createdCommunities", "name category members");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error fetching profile",
            error: error.message,
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, age, college, bio, graduationYear, interests, profilePicture, banner } = req.body;

        // Get current user to check for old profile picture and banner
        const currentUser = await User.findById(userId);
        let profilePictureUrl = profilePicture;
        let bannerUrl = banner;

        // If profilePicture is provided and it's a base64 string, upload it to Supabase
        if (profilePicture && typeof profilePicture === "string" && profilePicture.startsWith("data:image")) {
            try {
                const oldPictureUrl = currentUser.profilePicture;
                const buffer = base64ToBuffer(profilePicture);
                const fileName = `profile-${userId}.jpg`;
                profilePictureUrl = await uploadImage(buffer, fileName, "users");

                // Delete old profile picture if it exists
                if (oldPictureUrl) {
                    await deleteImage(oldPictureUrl);
                }
            } catch (uploadError) {
                console.error("Error uploading profile picture:", uploadError);
                // Continue without uploading image
                profilePictureUrl = currentUser.profilePicture || null;
            }
        }

        // If banner is provided and it's a base64 string, upload it to Supabase
        if (banner && typeof banner === "string" && banner.startsWith("data:image")) {
            try {
                const oldBannerUrl = currentUser.banner;
                const buffer = base64ToBuffer(banner);
                const fileName = `banner-${userId}.jpg`;
                bannerUrl = await uploadImage(buffer, fileName, "users");

                // Delete old banner if it exists
                if (oldBannerUrl) {
                    await deleteImage(oldBannerUrl);
                }
            } catch (uploadError) {
                console.error("Error uploading banner:", uploadError);
                // Continue without uploading image
                bannerUrl = currentUser.banner || null;
            }
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                name,
                age,
                college,
                bio,
                graduationYear,
                interests,
                profilePicture: profilePictureUrl,
                banner: bannerUrl,
                updatedAt: new Date(),
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error updating profile",
            error: error.message,
        });
    }
};

// Update location
exports.updateLocation = async (req, res) => {
    try {
        const userId = req.userId;
        const { country, state, city } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                location: { country, state, city },
                updatedAt: new Date(),
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Location updated successfully",
            user,
        });
    } catch (error) {
        console.error("Update location error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error updating location",
            error: error.message,
        });
    }
};

// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;

        // Delete user and their communities
        await User.findByIdAndDelete(userId);
        await Community.deleteMany({ createdBy: userId });

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("Delete account error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error deleting account",
            error: error.message,
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);
        
        // Update password
        user.password = hashedPassword;
        user.updatedAt = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error changing password",
            error: error.message,
        });
    }
};
