const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { body, validationResult } = require("express-validator"); // For input validation

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

// @route   POST /api/auth/register
// @desc    Register a new user
router.post(
  "/register",
  validateInput([
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ]),
  registerUser
);

// @route   POST /api/auth/login
// @desc    Log in an existing user
router.post(
  "/login",
  validateInput([
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  loginUser
);

module.exports = router;