import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // console.log("File uploaded on cloudinary. File src: " + response.url);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return nulls;
  }
};

const deleteFromCloudinary = async (imageUrl) => {
  try {
    // const publicId =   imageUrl.split("/");
    // const filename = parts[parts.length - 1]; // Get last part of URL
    // return filename.split(".")[0]; // Remove file extension

    const publicId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
    // console.log("Images deleted from Cloudinary:", publicId);
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
    throw new Error("Cloudinary image deletion failed");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
