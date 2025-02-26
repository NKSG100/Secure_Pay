const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  getUserById,
  getAllUsers,
} = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const { param, validationResult } = require("express-validator");

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

router.get("/profile", authenticate, getUserDetails);

router.get(
  "/:id",
  authenticate,
  validateInput([param("id").isMongoId()]),
  getUserById
);

router.get("/", authenticate, getAllUsers);

module.exports = router;