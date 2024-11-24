import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

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
