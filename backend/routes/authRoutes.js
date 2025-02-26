const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { body, validationResult } = require("express-validator");

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

router.post(
  "/register",
  validateInput([
    body("username").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ]),
  registerUser
);

router.post(
  "/login",
  validateInput([body("email").isEmail(), body("password").notEmpty()]),
  loginUser
);

module.exports = router;