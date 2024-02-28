import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOOSE_URL);
    // console.log("Connected to Mongoose database " + conn.connection.host);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
