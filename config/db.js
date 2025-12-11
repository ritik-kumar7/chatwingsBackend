import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('database connected successfully...')

    }
    catch (err) {
        console("Error database connection", err.message);

    }

}

export default connectDb;