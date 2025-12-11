import MessageModel from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import uploadCloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/soket.js";


const contactForSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedUserId } }).select("-password");

        if (users) {
            return res.status(200).json({ success: true, data: users })
        }

    } catch (error) {
        console.log("Error in contactForSidebar controller", error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const getMessages = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params._id;
        const messages = await MessageModel.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 })

        if (messages) {
            return res.status(200).json({ success: true, data: messages })
        }

    } catch (error) {
        console.log("Error in getMessages controller", error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const sendMessage = async (req, res) => {
    try {
        const { text, media } = req.body;
        const senderId = req.user._id;
        const receiverId = req.params._id;

        let mediaUrl;
        if (media) {
            const updatedMedia = await uploadCloudinary(media);
            mediaUrl = updatedMedia.secure_url;
        }

        const message = await MessageModel.create({
            senderId,
            receiverId,
            text,
            media: mediaUrl
        })

        // Send message via socket.io for real-time updates
        const receiverSocketIds = getReceiverSocketId(receiverId);
        if (receiverSocketIds) {
            receiverSocketIds.forEach(socketId => {
                io.to(socketId).emit("newMessage", message);
            });
        }

        if (message) {
            return res.status(201).json({ success: true, data: message })
        }

    } catch (error) {
        console.log("Error in sendMessage controller", error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.user._id;

        const message = await MessageModel.findById(messageId);
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this message" });
        }

        await MessageModel.findByIdAndDelete(messageId);

        const receiverSocketIds = getReceiverSocketId(message.receiverId);
        if (receiverSocketIds) {
            receiverSocketIds.forEach(socketId => {
                io.to(socketId).emit("messageDeleted", messageId);
            });
        }

        return res.status(200).json({ success: true, message: "Message deleted" });
    } catch (error) {
        console.log("Error in deleteMessage controller", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export default { contactForSidebar, getMessages, sendMessage, deleteMessage }