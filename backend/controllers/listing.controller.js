import Listing from "../models/listings.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);
    if (!newListing) {
      next(errorHandler(500, "An error occured while creating a new listing"));
      return;
    }
    res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "you can only view your own listiings"));

    const userListings = await Listing.find({ userRef: req.params.id });
    res.status(200).json({
      success: true,
      message: "User listings fetched successfully",
      data: userListings,
    });
  } catch (error) {
    next(error);
  }
};
