import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";

import dotenv from "dotenv";
dotenv.config();

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  path: "/", // ✅ Ensures the cookie is accessible across all routes
  // maxAge: 24 * 60 * 60 * 1000 * 10, // 10day
};
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password, role, phone, referralCode } = req.body;

  if ([email, userName, password, role].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }, { phone }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with email or userName or phone number already exists"
    );
  }

  let referredUser;
  if (referralCode) {
    referredUser = await User.findOne({ referralCode });
    if (!referredUser) {
      throw new ApiError(404, "invalid referralCode");
    }
  }

  const userValues = {
    userName,
    email,
    role,
    password,
    phone,
  };

  if (referredUser) {
    userValues.referredBy = referredUser._id;
  }

  const user = await User.create(userValues);

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const createdUser = await User.findByIdAndUpdate(
    user._id,
    {
      refreshToken,
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user");
  }

  if (referredUser) {
    referredUser.referredUsers.push(createdUser._id);
    await referredUser.save();
  }

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser, accessToken, refreshToken },
        "User registered successfully"
      )
    );

  //
});

const logInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password or user credentials");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const roleOfUser = loggedInUser.role;

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          role: roleOfUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    );
});

const getAllUsers = asyncHandler(async (req, res) => {
  // need to modify
  const users = await User.find();
  if (!users) {
    throw new ApiResponse(400, "No users found");
  }
  res
    .status(200)
    .send(
      new ApiResponse(
        201,
        users,
        `Total ${users.length} users fetched successfully`
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request ");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "invalid refresh token ");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changePass = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});

const logOut = asyncHandler(async (req, res) => {
  // clear cookie
  await User.findByIdAndUpdate(
    req.user._id,
    {
      // $set :{
      //   refreshToken:undefined
      // }
      $unset: {
        refreshToken: 1, //this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});

const getUser = asyncHandler(async (req, res) => {
  // console.log("got called");
  const userFromReq = req.user;
  const user = await User.findById(userFromReq._id).select("-password");

  if (!user) {
    throw new ApiError(404, "you are not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user fetched successfully"));
});

const getReferredUsers = asyncHandler(async (req, res) => {
  const userFromReq = req.user;
  const user = await User.findById(userFromReq._id).select("-password");

  if (!user) {
    throw new ApiError(404, "You are not authorized");
  }

  const referredUsers = await User.aggregate([
    {
      $match: { _id: user._id }, // Match the logged-in user
    },
    {
      $unwind: {
        path: "$referredUsers",
      },
    },
    {
      $lookup: {
        from: "users", // Lookup referred user details
        localField: "referredUsers",
        foreignField: "_id",
        as: "referredUsers_details",
      },
    },
    {
      $addFields: {
        refrredUserDetails: {
          $arrayElemAt: ["$referredUsers_details", 0], // Extract first element
        },
      },
    },
    {
      $project: {
        _id: 0,
        "refrredUserDetails.userName": 1,
        "refrredUserDetails.email": 1,
        "refrredUserDetails.createdAt": 1, // This is the join date
      },
    },
  ]);

  res.status(200).json({
    success: true,
    referredUsers,
  });
});

export {
  registerUser,
  logInUser,
  getAllUsers,
  // -------- secure auth
  refreshAccessToken,
  getUser,
  logOut,
  changePass,
  getReferredUsers,
};
