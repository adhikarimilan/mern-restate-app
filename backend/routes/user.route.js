import express from "express";
import {
  index,
  updateUserInfo,
  deleteUserInfo,
  getUserInfo,
} from "../controllers/user.controller.js";
import { verifyUserToken } from "../utils/verifyUserToken.js";

const router = express.Router();

router.get("/", index);
router.get("/:id", getUserInfo);
router.post("/update/:id", verifyUserToken, updateUserInfo);
router.delete("/delete/:id", verifyUserToken, deleteUserInfo);

export default router;
