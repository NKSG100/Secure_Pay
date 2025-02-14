const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  createTransaction,
  getTransactions,
  updateTransactionStatus,
} = require("../controllers/transactionController");
const { body, param, validationResult } = require("express-validator"); // For input validation

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

// @route   POST /api/transactions
// @desc    Create a new transaction (deposit, withdrawal, or transfer)
// @access  Private
router.post(
  "/",
  authenticate,
  validateInput([
    body("amount").isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),
    body("transactionType")
      .isIn(["deposit", "withdrawal", "transfer"])
      .withMessage("Invalid transaction type"),
    body("receiverId")
      .if(body("transactionType").equals("transfer"))
      .notEmpty()
      .withMessage("Receiver ID is required for transfers"),
  ]),
  createTransaction
);

// @route   GET /api/transactions
// @desc    Get all transactions of a user
// @access  Private
router.get("/", authenticate, getTransactions);

// @route   PUT /api/transactions/:id
// @desc    Update transaction status
// @access  Private
router.put(
  "/:id",
  authenticate,
  validateInput([
    param("id").isMongoId().withMessage("Invalid transaction ID"),
    body("status")
      .isIn(["pending", "completed", "failed"])
      .withMessage("Invalid status"),
  ]),
  updateTransactionStatus
);

module.exports = router;