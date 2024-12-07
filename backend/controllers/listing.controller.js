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
