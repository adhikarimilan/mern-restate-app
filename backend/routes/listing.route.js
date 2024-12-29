import express from "express";
import {
  createListing,
  getUserListing,
  updateUserListing,
  deleteUserListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyUserToken } from "../utils/verifyUserToken.js";

const router = express.Router();

router.post("/create", verifyUserToken, createListing);
router.get("/user/:id", verifyUserToken, getUserListing);
router.get("/get/:id", getListing);
router.get("/", getListings);
router.put("/update/:id", verifyUserToken, updateUserListing);
router.delete("/delete/:id", verifyUserToken, deleteUserListing);

export default router;
