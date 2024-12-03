import User from "../models/users.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const index = (req, res) => {
  res.json({ message: "hello there" });
};

export const updateUserInfo = async (req, res, next) => {
  let newPassword = undefined;

  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own details"));

  try {
    const validUser = await User.findById(req.params.id);

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    //console.log(req.body);
    if (req.body.currentPassword && req.body.newPassword) {
      const validPassword = bcryptjs.compareSync(
        req.body.currentPassword,
        validUser.password
      );
      //console.log(validUser);
      if (!validPassword)
        return next(
          errorHandler(
            404,
            "Your current password do not match on our database"
          )
        );
      newPassword = bcryptjs.hashSync(req.body.newPassword, 10);
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: validUser._id },
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: newPassword,
          photo: req.body.photo,
        },
      },
      { new: true }
    );
    const { passwod, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {}
};
