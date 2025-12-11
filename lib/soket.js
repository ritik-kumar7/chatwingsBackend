import express from "express";
import http from "http";
import { Server } from "socket.io";


const app = express();
const server = http.createServer(app);
const userSocket = {}
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocket[receiverId];
}

io.on("connection", (socket) => {
    console.log("user connected", socket.id)
    const userId = socket.handshake.query.userId
    if (userId) {
        if (!userSocket[userId]) {
            userSocket[userId] = [];
        }
        userSocket[userId].push(socket.id);
    }

    io.emit("getOnlineUsers", Object.keys(userSocket))
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
        if (userId && userSocket[userId]) {
            userSocket[userId] = userSocket[userId].filter(id => id !== socket.id);
            if (userSocket[userId].length === 0) {
                delete userSocket[userId];
            }
        }
        io.emit("getOnlineUsers", Object.keys(userSocket))
    })
})

export { app, server, io }