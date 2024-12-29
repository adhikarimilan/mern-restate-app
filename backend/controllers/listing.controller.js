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

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = undefined;
    if (req.query.parking) parking = parseInt(req.query.parking);

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    const { __v, ...rest } = listing._doc;
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
