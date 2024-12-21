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

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    const { userRef, createdAt, updatedAt, __v, ...rest } = listing._doc;
    res.status(200).json({
      success: true,
      message: "Fetched successfully",
      listing: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "you can only view your own listings"));

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

export const updateUserListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));

    if (req.user.id !== listing.userRef)
      return next(errorHandler(401, "You can only edit your own listings"));

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedListing)
      return next(errorHandler(500, "An error occured while updating"));

    res.status(201).json({
      success: true,
      message: "Successfully updated the listing",
      listing: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return next(errorHandler(404, "Listing not found"));
    if (req.user.id !== listing.userRef)
      return next(errorHandler(401, "You can only delete your own listings"));

    const deletelisting = await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Sucessfully deleted" });
  } catch (error) {
    next(error);
  }
};
