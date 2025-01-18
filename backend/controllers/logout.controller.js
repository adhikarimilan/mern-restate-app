import { errorHandler } from "../utils/error.js";

export const logout = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res
      .status(200)
      .json({ success: true, message: "User has been logged out" });
  } catch (error) {
    next(errorHandler(error));
  }
};
