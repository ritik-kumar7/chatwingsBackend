import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;