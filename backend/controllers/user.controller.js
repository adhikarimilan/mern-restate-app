import User from "../models/users.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const index = (req, res, next) => {
  res.json({ message: "hello there" });
};

export const getUserInfo = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) next(errorHandler(404, "User not found"));

  const { password, createdAt, updatedAt, __v, ...rest } = user._doc;

  res.status(200).json({
    success: true,
    message: "User info successfully fetched",
    user: rest,
  });
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
    const updateFields = {
      userName: req.body.userName,
      email: req.body.email,
      photo: req.body.photo,
    };

    // Add password only if newPassword is defined
    if (newPassword) {
      updateFields.password = newPassword;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: validUser._id },
      { $set: updateFields },
      { new: true }
    );

    const { passwod, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(500, `An error occured: ${error}`));
  }
};

export const deleteUserInfo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "You can only update your own details"));

    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser)
      next(errorHandler(500, "An error occured while completing your request"));

    res
      .status(200)
      .json({ success: true, message: "Account Deletion Successfull!" });
  } catch (error) {
    next(errorHandler(500, `An error occured: ${error}`));
  }
};
