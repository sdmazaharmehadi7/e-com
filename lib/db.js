import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Ensure indexes are created
  const db = mongoose.connection;
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
};

export default connectDB;