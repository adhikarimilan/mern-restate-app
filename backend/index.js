import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

//routes
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();
app.use(express.json());

//cookieparserc
app.use(cookieParser());

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

//routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

//middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    fullerror: err,
  });
});
