const User = require("../models/User");

// @desc    Get details of the authenticated user
// @route   GET /api/users/profile
// @access  Private
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      username: user.username,
      email: user.email,
      balance: user.balance,
      friends: user.friends,
    });
  } catch (error) {
    console.error("Get User Details Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get details of a specific user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 }); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all users (for admin purposes)
// @route   GET /api/users
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a friend to the authenticated user's friend list
// @route   POST /api/users/friends
// @access  Private
const addFriend = async (req, res) => {
  const { friendId } = req.body;

  try {
    // Check if the friend exists
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the friend to the current user's friend list
    const user = await User.findById(req.user.id);
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "User is already a friend" });
    }

    user.friends.push(friendId);
    await user.save();

    res.status(200).json({ message: "Friend added successfully", friends: user.friends });
  } catch (error) {
    console.error("Add Friend Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get the authenticated user's friend list
// @route   GET /api/users/friends
// @access  Private
const getFriends = async (req, res) => {
  console.log(req.user.id);
  try {
    const user = await User.findById(req.user.id).populate("friends", "username _id");
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Get Friends Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserDetails,
  getUserById,
  getAllUsers,
  addFriend,
  getFriends,
};