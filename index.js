import express from "express";
import dotenv from 'dotenv'
import connectDb from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import { app, server } from "./lib/soket.js";

dotenv.config();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(cookieParser());


//api routes 
app.use('/api/user', authRouter)
app.use('/api/message', messageRouter)




server.listen(port, () => {
    connectDb();
    console.log("server is running on port " + port)
});