import mongoose from 'mongoose';
import process from 'process';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn('MONGO_URI is not defined in environment variables. Defaulting to mongodb://localhost:27017/beyondchats_articles');
        }
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beyondchats_articles');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
