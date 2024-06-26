import dotenv from "dotenv";
import connectDB from "./db/ConnectDb.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERRR: ", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log("Database connected to" + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Database Connection failed ", err);
  });