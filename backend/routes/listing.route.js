import express from "express";
import {
  createListing,
  getUserListing,
  editUserListing,
  deleteUserListing,
} from "../controllers/listing.controller.js";
import { verifyUserToken } from "../utils/verifyUserToken.js";

const router = express.Router();

router.post("/create", verifyUserToken, createListing);
router.get("/user/:id", verifyUserToken, getUserListing);
router.get("/edit/:id", verifyUserToken, editUserListing);
router.delete("/delete/:id", verifyUserToken, deleteUserListing);

export default router;
