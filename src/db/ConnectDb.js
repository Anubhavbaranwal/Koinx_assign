
import  mongoose from "mongoose";

const connectDB = async () => {
    const DB_NAME =  "trades";
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
    // throw err;
  }
};

export default connectDB;