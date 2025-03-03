import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import mongoose from "mongoose";
import { Address } from "../models/address.models.js";
import { User } from "../models/user.models.js";

const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized request");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(404, "User id is not valid");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User Not Found");

  const { fullName, country, address, city, pinCode } = req.body;

  if ([fullName, country, address, city].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  if (!pinCode) {
    throw new ApiError(400, "pinCode required");
  }

  const savedAddress = await Address.create({
    fullName,
    country,
    address,
    city,
    pinCode,
    user: user._id,
  });

  // Fetch the newly created address and populate user
  const populatedAddress = await Address.findById(savedAddress._id).populate(
    "user",
    "userName email phone"
  );

  if (!populatedAddress) {
    throw new ApiError(500, "Something went wrong while adding address");
  }

  user.Address.push(populatedAddress._id);
  await user.save();

  return res
    .status(200)
    .send(new ApiResponse(200, populatedAddress, "Address saved successfully"));
});

const getAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized request");
  }
  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(404, "Invalid User ID");
  }

  // Fetch all addresses for the user
  const addresses = await Address.find({
    user: userId,
    isDeleted: false,
  }).populate("user", "userName email phone");

  return res
    .status(200)
    .send(new ApiResponse(200, addresses, "Addresses fetched successfully"));
});
const getSingleAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized request");
  }

  const { addressId } = req.params;

  // Check if the addressId is valid
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(404, "Invalid Address ID");
  }

  // Find the address by ID
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  }).populate("user", "userName email phone");

  // If no address is found, throw an error
  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // If address is found, return it with success message
  return res
    .status(200)
    .send(new ApiResponse(200, address, "Address fetched successfully"));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized request");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User Not Found");

  // Validate addressId
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(404, "Invalid Address ID");
  }

  // Delete address by ID
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  address.isDeleted = true; // ✅ Soft delete instead of removing
  await address.save();

  await User.findByIdAndUpdate(userId, {
    $pull: { Address: addressId },
  });

  return res
    .status(200)
    .send(new ApiResponse(200, null, "Address deleted successfully"));
});

const editSingleAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized request");
  }

  // Validate addressId
  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(404, "Invalid Address ID");
  }

  // Find the address to ensure it exists
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });
  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // Update only the fields that are provided in the request body
  const updatedFields = {};
  if (req.body.country) updatedFields.country = req.body.country;
  if (req.body.fullName) updatedFields.fullName = req.body.fullName;
  if (req.body.address) updatedFields.address = req.body.address;
  if (req.body.pinCode) updatedFields.pinCode = req.body.pinCode;
  if (req.body.city) updatedFields.city = req.body.city;

  // Update the address with only the provided fields
  const updatedAddress = await Address.findByIdAndUpdate(
    addressId,
    { $set: updatedFields }, // Only update the fields that were passed
    { new: true, runValidators: true } // Return the updated document
  );

  if (!updatedAddress) {
    throw new ApiError(500, "Error while updating the address");
  }

  return res
    .status(200)
    .send(new ApiResponse(200, updatedAddress, "Address updated successfully"));
});

const checkUserHasAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(404, "user id not found");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const addresses = await Address.find({ user: userId }).populate(
    "user",
    "userName email phone"
  );
  if (!addresses || !addresses.length === 0) {
    throw new ApiError(400, "No address found in database");
  }
  return res
    .status(200)
    .send(new ApiResponse(200, addresses, "addresses fetched successfully"));
});

const restoreAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;

  const address = await Address.findOne({ _id: addressId, user: userId });

  if (!address) throw new ApiError(404, "Address not found");

  if (!address.isDeleted) throw new ApiError(400, "Address is not deleted");

  address.isDeleted = false; // ✅ Restore address
  await address.save();

  await User.findByIdAndUpdate(userId, {
    $push: { Address: addressId },
  });

  return res
    .status(200)
    .send(new ApiResponse(200, address, "Address restored successfully"));
});

const getDeletedAddresses = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const deletedAddresses = await Address.find({
    user: userId,
    isDeleted: true,
  }).populate("user", "userName email");

  if (!deletedAddresses.length) {
    throw new ApiError(404, "No deleted addresses found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedAddresses,
        "Deleted addresses fetched successfully"
      )
    );
});

export {
  addAddress,
  getAddress,
  getSingleAddress,
  editSingleAddress,
  deleteAddress,
  checkUserHasAddress,
  restoreAddress,
  getDeletedAddresses,
};
