import User from "../models/users.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
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
    res.status(500).json({ message: error });
  }
};
