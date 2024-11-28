import User from "../models/users.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const google = async (req, res, next) => {
  try {
    const validUser = await User.findOne({ email: req.body.email });
    //console.log(validUser);
    if (!validUser) {
      const getPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const uname =
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);
      const makeUser = {
        userName: uname,
        email: req.body.email,
        password: bcryptjs.hashSync(getPassword, 10),
        photo: req.body.photo,
      };
      const newUser = new User(makeUser);
      await newUser.save();
      //console.log(newUser);
      //signing in the user
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      newUser.password = null;
      const { password, ...userData } = newUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000 * 24 * 30,
        })
        .status(200)
        .json({ success: true, userData });
    } else {
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
      validUser.password = null;
      const { password, ...userData } = validUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000 * 24 * 30,
        })
        .status(200)
        .json({ success: true, userData });
    }
  } catch (error) {
    next(error);
  }
};
