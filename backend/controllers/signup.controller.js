import User from "../models/users.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const newUser = {
    userName: req.body.username,
    email: req.body.email,
    password: bcryptjs.hashSync(req.body.password, 10),
  };
  const user = new User(newUser);
  try {
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
    //next(errorHandler(501, "An unexpected error took place"));
  }
};
