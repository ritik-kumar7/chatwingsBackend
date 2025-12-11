import express from "express";
import messageController from "../controllers/messageController.js";
import checkAuth from "../middleware/authMiddleware.js";

const messageRouter = express.Router();

messageRouter.get("/contactForSidebar", checkAuth, messageController.contactForSidebar);
messageRouter.get("/getMessages/:_id", checkAuth, messageController.getMessages);
messageRouter.post("/sendMessage/:_id", checkAuth, messageController.sendMessage);
messageRouter.delete("/deleteMessage/:messageId", checkAuth, messageController.deleteMessage);


export default messageRouter;
