import mongoose from "mongoose";

const connectDatabase = () => {
  return mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(`Successfully connected to MongoDB`);
    })
    .catch((err) => console.error(err));
};

export default connectDatabase;