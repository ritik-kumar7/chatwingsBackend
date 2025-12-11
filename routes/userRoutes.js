import express from "express";
import authController from "../controllers/authController.js";
import checkAuth from "../middleware/authMiddleware.js";


const authRouter = express.Router();

authRouter.get("/check-auth", checkAuth, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});
authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.get("/logout", authController.logout);
authRouter.put('/update-profile-photo', checkAuth, authController.updateProfilePhoto)



export default authRouter


