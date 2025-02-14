const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  getUserById,
  getAllUsers,
  addFriend,
  getFriends,
} = require("../controllers/userController"); // Import all functions at once
const authenticate = require("../middleware/authMiddleware");
const { param, body, validationResult } = require("express-validator"); // For input validation

// Input validation middleware
const validateInput = (validationRules) => {
  return [
    validationRules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

// @route   GET /api/users/profile
// @desc    Get details of the authenticated user
// @access  Private
router.get("/profile", authenticate, getUserDetails);

// @route   GET /api/users/:id
// @desc    Get details of a specific user by ID
// @access  Private
router.get(
  "/:id",
  authenticate,
  validateInput([param("id").isMongoId().withMessage("Invalid user ID")]),
  getUserById
);

// @route   GET /api/users
// @desc    Get all users (for admin purposes)
// @access  Private
router.get("/", authenticate, getAllUsers);

// @route   POST /api/users/friends
// @desc    Add a friend to the authenticated user's friend list
// @access  Private
router.post(
  "/friends",
  authenticate,
  validateInput([
    body("friendId").isMongoId().withMessage("Invalid friend ID"),
  ]),
  addFriend
);

// @route   GET /api/users/friends
// @desc    Get the authenticated user's friend list
// @access  Private
router.get("/friends", authenticate, getFriends);

module.exports = router;