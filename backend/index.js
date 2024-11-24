import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//routes
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();
app.use(express.json());

app.listen(process.env.SERVER_PORT, () => {
  mongoose
    .connect(process.env.MongoDBUrl)
    .then(() => {
      console.log("Connected to the Database");
    })
    .catch((error) => {
      console.error(`An error Occured while connected to the db: ${error}}`);
    });
  console.log(`server is running on port ${process.env.SERVER_PORT}`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
