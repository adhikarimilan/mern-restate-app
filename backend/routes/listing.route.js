import express from "express";
import {
  createListing,
  getUserListing,
  updateUserListing,
  deleteUserListing,
} from "../controllers/listing.controller.js";
import { verifyUserToken } from "../utils/verifyUserToken.js";

const router = express.Router();

router.post("/create", verifyUserToken, createListing);
router.get("/user/:id", verifyUserToken, getUserListing);
router.put("/update/:id", verifyUserToken, updateUserListing);
router.delete("/delete/:id", verifyUserToken, deleteUserListing);

export default router;
