import express from "express";
import { index, updateUserInfo } from "../controllers/user.controller.js";
import { verifyUserToken } from "../utils/verifyUserToken.js";

const router = express.Router();

router.get("/", index);
router.post("/update/:id", verifyUserToken, updateUserInfo);

export default router;
