import genrateToken from "../lib/token.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import uploadCloudinary from "../utils/cloudinary.js";
import { io } from "../lib/soket.js";

const signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json({ success: false, message: "all field required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "password must be at least 6 characters long" });
        }

        const existEmail = await User.findOne({ email });
        const existUserName = await User.findOne({ userName });


        if (existEmail) {
            return res.status(400).json({ success: false, message: "email already exist " });
        }
        if (existUserName) {
            return res.status(400).json({ success: false, message: "username already exist " });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            userName,
            email,
            password: hashPassword
        })

        if (user) {
            genrateToken(user._id, res)
            const userResponse = { ...user.toObject() }
            delete userResponse.password
            return res.status(201).json({ success: true, message: "User created successfully", user: userResponse })
        }



    } catch (error) {
        console.log("error for creating user ", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "all field required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" });

        }

        const userPasswrod = await bcrypt.compare(password, user.password);

        if (!userPasswrod) {
            return res.status(400).json({ success: false, message: "wrong password" });

        }

        genrateToken(user._id, res);
        const userResponse = { ...user.toObject() }
        delete userResponse.password
        return res.status(200).json({ success: true, message: "User login successfully", user: userResponse });


    } catch (error) {
        console.log("error for login user ", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });

    }
}


const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ success: true, message: "logout successfull " });

    } catch (error) {
        return res.status(500).json({ success: false, message: "internal server error " });
    }
}


const updateProfilePhoto = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ success: false, message: "profile pic is required" })
        }
        const uploadImage = await uploadCloudinary(profilePic);

        if (!uploadImage) {
            return res.status(400).json({ success: false, message: "Failed to upload image to cloudinary" })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" })
        }

        user.profilePicture = uploadImage.secure_url;
        await user.save();

        const userResponse = { ...user.toObject() }
        delete userResponse.password
        
        io.emit("profileUpdated", { userId: userId.toString(), profilePicture: uploadImage.secure_url });
        
        return res.status(200).json({ success: true, message: "profile pic updated successfully", user: userResponse })





    }
    catch (error) {
        console.log('error while update profile', error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export default { signup, login, logout, updateProfilePhoto };