import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    Address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
      required: true,
      index: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User who referred this user
      ref: "User",
    },
    referralCode: {
      type: String, // Unique code generated for each user
      unique: true,
    },
    referredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId, // List of users referred by this user
        ref: "User",
      },
    ],
    phone: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Define compound indexes for efficient searching
userSchema.index({ email: 1, phone: 1 }); // Compound index

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  return next();
});

// Method to compare passwords
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.userName,
      fullName: this.fullName,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Generate a unique referral code on user creation
userSchema.pre("save", async function (next) {
  if (!this.referralCode) {
    let uniqueCode;
    do {
      uniqueCode = Math.floor(1000 + Math.random() * 9000).toString();
    } while (await User.exists({ referralCode: uniqueCode }));
    this.referralCode = uniqueCode;
  }
  next();
});

export const User = mongoose.model("User", userSchema);
