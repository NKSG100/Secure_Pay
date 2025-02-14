const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"], // Custom error message
      unique: true,
      trim: true, // Remove extra spaces
      minlength: [3, "Username must be at least 3 characters long"], // Minimum length
      maxlength: [30, "Username cannot exceed 30 characters"], // Maximum length
    },
    email: {
      type: String,
      required: [true, "Email is required"], // Custom error message
      unique: true,
      trim: true, // Remove extra spaces
      lowercase: true, // Convert email to lowercase
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email address", // Custom error message
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Custom error message
      minlength: [6, "Password must be at least 6 characters long"], // Minimum length
    },
    balance: {
      type: Number,
      default: 0, // Default value
      min: [0, "Balance cannot be negative"], // Minimum value validation
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to other users
      },
    ],
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Invalid role", // Custom error message
      },
      default: "user", // Default value
    },
    date: {
      type: Date,
      default: Date.now, // Default value
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true }, // Include virtuals in object output
  }
);

// Virtual for formatted date
userSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

module.exports = mongoose.model("User", userSchema);