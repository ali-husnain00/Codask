import mongoose from "mongoose";
import AppError from "../utils/appError.js";

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb connected successfully!");
    } catch (error) {
        throw new AppError(
            "Database connection failed",
            500,
            "DB_CONNECTION_FAILED",
            process.env.NODE_ENV !== "production" ? error.message : null
        );
    }
}

export default connectDB;