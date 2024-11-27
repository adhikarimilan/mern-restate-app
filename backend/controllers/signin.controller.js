import User from "../models/users.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signin = async (req, res, next) => {
  try {
    const usercredentials = {
      email: req.body.email,
      password: req.body.password,
    };
    // Query using $or to search by email or username
    const query = {
      $or: [
        { email: usercredentials.email }, // Match email
        { userName: usercredentials.email }, // Match username
      ],
    };

    const validUser = await User.findOne(query);
    if (!validUser) {
      return next(
        errorHandler(404, "User with the given credentials not found")
      );
    }
    const validPassword = bcryptjs.compareSync(
      usercredentials.password,
      validUser.password
    );
    if (!validPassword)
      return next(
        errorHandler(404, "Your credentials do not match on our database")
      );
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
  } catch (error) {
    next(error);
    //next(errorHandler(501, "An unexpected error took place"));
  }
};
