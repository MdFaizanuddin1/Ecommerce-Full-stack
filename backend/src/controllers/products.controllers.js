import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/products.models.js";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  if (!products) {
    throw new ApiError(400, "There are no products");
  }

  return res
    .status(200)
    .send(
      new ApiResponse(
        201,
        products,
        `total ${products.length} products fetched successfully`
      )
    );
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const productId = req.query.productId;

  const barcodeNumber = req.query.barcodeNumber;

  if (!productId && !barcodeNumber) {
    throw new ApiError(400, "please enter either barcode number or product id");
  }

  let product;
  if (productId) {
    product = await Product.findById(productId);
    if (!product) throw new ApiError(400, "No product is found");
  } else {
    product = await Product.findOne({ barcodeNumber });
    if (!product) throw new ApiError(400, "No product is found");
  }

  return res
    .status(200)
    .send(new ApiResponse(200, product, "product found successfully"));
});

const getProductByQuery = async (req, res) => {
  const { name } = req.query; // Get search query from URL

  if (!name) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // Find products that start with the query
    const products = await Product.find({
      productName: { $regex: name, $options: "i" }, // Case insensitive match
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          products,
          "Product with query fetched successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Internal server Error"));
  }
};

const authDeleteProductById = asyncHandler(async (req, res) => {
  // Ensure the user is an admin
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized: Only admins can delete products");
  }

  const { productId } = req.params; // Get the product ID from request params
  if (!productId) {
    throw new ApiError(400, "product id is required");
  }

  // Validate productId format (Optional, but recommended)
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID format");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found or already deleted");
  }

  // Delete images from Cloudinary
  try {
    await Promise.all(
      product.image.map(
        async (imageUrl) => await deleteFromCloudinary(imageUrl)
      )
    );
    // console.log("All product images deleted from Cloudinary");
  } catch (error) {
    console.error("Failed to delete images from Cloudinary:", error);
    throw new ApiError(
      500,
      "Error while deleting product images from Cloudinary"
    );
  }

  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) {
    throw new ApiError(404, "product deletion failed");
  }
  return res
    .status(200)
    .send(new ApiResponse(200, deletedProduct, "product deleted successfully"));
});

const authEditProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params; // Get the product ID from request params
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // Ensure the user is an admin
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized: Only admins can edit products");
  }

  // Validate productId format (Optional, but recommended)
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID format");
  }

  // Find the product by ID
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const {
    productName,
    price,
    category,
    bestseller,
    description,
    age,
    gender,
    stock,
  } = req.body;

  // Create an object for the fields to be updated
  const updateFields = {};

  // Conditional checking for each field before updating
  if (productName) updateFields.productName = productName;
  if (typeof price !== "undefined") updateFields.price = price;
  if (category) updateFields.category = category;
  if (typeof bestseller !== "undefined") updateFields.bestseller = bestseller; // checking for boolean
  if (description) updateFields.description = description;
  if (age) updateFields.age = age;
  if (gender) updateFields.gender = gender;
  if (typeof stock !== "undefined") updateFields.stock = stock; // checking for undefined

  // Check if there are fields to update
  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "No fields to update");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId, // Find the product by ID
    { $set: updateFields }, // Set the fields to update
    { new: true, runValidators: true } // Options: return the updated document, validate the update
  );

  if (!updatedProduct) {
    throw new ApiError(500, "Error while updating the product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

const authAddProduct = asyncHandler(async (req, res) => {
  // Ensure the user is an admin
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized: Only admins can add products");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let {
    productName,
    price,
    category,
    bestseller,
    description,
    age,
    gender,
    stock,
    barcodeNumber,
  } = req.body;

  stock = Number(stock);
  barcodeNumber = Number(barcodeNumber);
  price = Number(price);

  // Validate required fields
  const requiredFields = [
    productName,
    price,
    description,
    age,
    gender,
    stock,
    barcodeNumber,
  ];
  if (
    requiredFields.some(
      (field) => typeof field === "string" && field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Validate numeric fields
  if ([price, stock, barcodeNumber].some((field) => isNaN(field))) {
    throw new ApiError(
      400,
      "Price, stock, and barcodeNumber must be valid numbers"
    );
  }

  // Handle image uploads locally
  // const images = req.files?.image || [];
  // const imageUrls = images.map(
  //   (img) => `${req.protocol}://${req.get("host")}/${img.filename}`
  // );

  // if (imageUrls.length === 0) {
  //   throw new ApiError(400, "At least one image is required");
  // }

  // upload on cloudinary
  // const images = req.files?.image[0].path // for only one image
  // console.log('req.file is ',req.files)
  // console.log('images path', images)
  // const cloudinaryResponses  = await uploadOnCloudinary (images)
  // const imageUrls = cloudinaryResponses.url

  // const images = req.files.image; // Ensure this contains multiple images
  // // console.log("All images:", images);
  // const imagePaths = images.map((img) => img.path);
  // // console.log("Image paths:", imagePaths); //---- this give all image paths

  let imageUrls = [];

  try {
    const images = req.files.image || []; // Ensure it's an array
    // console.log('images is',images)
    if (images.length === 0) {
      throw new ApiError(400, "NO product image is uploaded");
    }

    // Upload all images to Cloudinary
    const cloudinaryResponses = await Promise.all(
      images.map(async (img) => await uploadOnCloudinary(img.path))
    );

    // Extract URLs from Cloudinary responses
    imageUrls = cloudinaryResponses
      .filter((res) => {
        // console.log('cloudinary response is ', res)
        return res;
      }) // Remove failed uploads (null responses)
      .map((res) => res.secure_url);

    // console.log("Uploaded Images:", imageUrls);
  } catch (error) {
    console.error("Upload Error:", error);
    throw new ApiError(
      500,
      "Something went wrong while uploading images on cloudinary"
    );
  }

  // Construct product data
  const productData = {
    productName,
    price,
    bestseller,
    description,
    image: imageUrls,
    age,
    gender,
    stock,
    barcodeNumber,
    // ...(category && { category }), // Add category only if it exists
  };

  // Conditionally add category
  if (category) {
    productData.category = category;
  }
  if (bestseller) {
    productData.bestseller = bestseller;
  }

  // Create the product
  const product = await Product.create(productData);

  if (!product) {
    throw new ApiError(500, "Something went wrong while adding the product");
  }

  return res
    .status(201)
    .send(new ApiResponse(201, product, "Product added successfully"));
});

const deleteAllProducts = asyncHandler(async (req, res) => {
  // Ensure the user is an admin
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized: Only admins can delete products");
  }

  // Fetch all products
  const products = await Product.find({});
  if (products.length === 0) {
    throw new ApiError(400, "No products are there to delete");
  }

  // Extract all Cloudinary image URLs
  const allImageUrls = products.flatMap((product) => product.image);

  // Delete images from Cloudinary using utility function
  try {
    await Promise.all(
      allImageUrls.map(async (imageUrl) => await deleteFromCloudinary(imageUrl))
    );
    // console.log("All product images deleted from Cloudinary");
  } catch (error) {
    console.error("Failed to delete images from Cloudinary:", error);
    throw new ApiError(
      500,
      "Error while deleting product images from Cloudinary"
    );
  }

  const deleted = await Product.deleteMany({});

  if (deleted.deletedCount < 1) {
    throw new ApiError(400, "No products are there to delete");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deleted.deletedCount,
        "All products deleted successfully"
      )
    );
});

const getAllProductsByField = asyncHandler(async (req, res) => {
  const { field, value } = req.body;

  if (!field || !value) {
    throw new ApiError(400, "Field and value are required");
  }

  const products = await Product.find({ [field]: value });

  if (!products.length) {
    throw new ApiError(400, "There are no products");
  }

  return res.status(200).send(
    new ApiResponse(
      200, // Status should match response code
      products,
      `Total ${products.length} products fetched successfully`
    )
  );
});

export {
  getAllProducts,
  getSingleProduct,
  getProductByQuery,
  //------------  modified  ---------- add auth
  authAddProduct,
  authDeleteProductById,
  authEditProduct,
  deleteAllProducts,
  getAllProductsByField,
};
