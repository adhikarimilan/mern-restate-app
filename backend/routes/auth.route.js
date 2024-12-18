import express from "express";
import { signup } from "../controllers/signup.controller.js";
import { signin } from "../controllers/signin.controller.js";
import { google } from "../controllers/google.controller.js";
import { logout } from "../controllers/logout.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/google", google);

export default router;
