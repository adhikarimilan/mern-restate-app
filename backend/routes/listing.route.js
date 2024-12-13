import express from "express";
import {
  createListing,
  getUserListing,
} from "../controllers/listing.controller.js";
import { verifyUserToken } from "../utils/verifyUserToken.js";

const router = express.Router();

router.post("/create", verifyUserToken, createListing);
router.get("/user/:id", verifyUserToken, getUserListing);

export default router;
