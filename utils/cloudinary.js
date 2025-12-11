import { v2 as cloudinary } from 'cloudinary';

const uploadCloudinary = async (filePath) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        });

        const result = await cloudinary.uploader.upload(filePath, {
            folder: "user_profiles"
        });

        return result;
    } catch (error) {
        console.log("Cloudinary upload error:", error.message);
        return null;
    }
};

export default uploadCloudinary;
