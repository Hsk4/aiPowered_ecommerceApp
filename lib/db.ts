import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
	if (mongoose.connection.readyState >= 1) {
		return;
	}

	const mongoUri = process.env.MONGO_URI;

	if (!mongoUri) {
		throw new Error("MONGO_URI is not defined");
	}

	await mongoose.connect(mongoUri);
	console.log("Connected to MongoDB");
};

export default connectDB;