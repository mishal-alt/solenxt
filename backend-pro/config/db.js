import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            console.error('❌ Error: MONGO_URI is not defined in .env file');
            process.exit(1);
        }

        console.log('⏳ Connecting to MongoDB...');

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Fail fast if database connection fails
        process.exit(1);
    }
};

export default connectDB;
