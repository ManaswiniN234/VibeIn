const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn(
        "⚠️  Supabase credentials not configured. Image uploads will be disabled."
    );
}

const supabase = supabaseUrl && supabaseKey 
    ? createClient(supabaseUrl, supabaseKey)
    : null;

/**
 * Upload image to Supabase storage
 * @param {Buffer} fileBuffer - The file buffer from request
 * @param {string} fileName - Original filename
 * @param {string} folder - Folder in storage bucket (e.g., 'users', 'communities')
 * @returns {Promise<string>} Public URL of the uploaded image
 */
const uploadImage = async (fileBuffer, fileName, folder = "uploads") => {
    if (!supabase) {
        throw new Error("Supabase is not configured");
    }

    try {
        // Generate unique filename
        const timestamp = Date.now();
        const uniqueFileName = `${folder}/${timestamp}-${fileName}`;

        // Upload to Supabase
        const { data, error } = await supabase.storage
            .from("vibein-images")
            .upload(uniqueFileName, fileBuffer, {
                cacheControl: "3600",
                upsert: false,
                contentType: "image/*",
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from("vibein-images")
            .getPublicUrl(uniqueFileName);

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error("Error uploading image to Supabase:", error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }
};

/**
 * Delete image from Supabase storage
 * @param {string} imageUrl - The public URL of the image
 */
const deleteImage = async (imageUrl) => {
    if (!supabase || !imageUrl) {
        return;
    }

    try {
        // Extract file path from URL
        const urlParts = imageUrl.split("/storage/v1/object/public/vibein-images/");
        if (urlParts.length < 2) {
            return;
        }

        const filePath = urlParts[1];

        // Delete from Supabase
        const { error } = await supabase.storage
            .from("vibein-images")
            .remove([filePath]);

        if (error) {
            console.warn("Error deleting image from Supabase:", error);
        }
    } catch (error) {
        console.warn("Error deleting image:", error);
    }
};

/**
 * Convert base64 image to buffer
 * @param {string} base64String - Base64 encoded image
 * @returns {Buffer} File buffer
 */
const base64ToBuffer = (base64String) => {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    return Buffer.from(base64Data, "base64");
};

module.exports = {
    supabase,
    uploadImage,
    deleteImage,
    base64ToBuffer,
};
