import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const checkAuth = async (req, res, next) => {
    try {
        // Read the correct cookie name
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Token is required" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

        // Find user (exclude password)
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        // Attach user to request object
        req.user = user;

        // Continue to next route
        next();

    } catch (error) {
        console.log("Error in auth middleware:", error.message);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export default checkAuth;
