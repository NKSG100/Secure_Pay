const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  createTransaction,
  getTransactions,
  updateTransactionStatus,
} = require("../controllers/transactionController");
const { body, param, validationResult } = require("express-validator");

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
  "/",
  authenticate,
  validateInput([
    body("amount").isFloat({ gt: 0 }),
    body("transactionType").isIn(["deposit", "withdrawal", "transfer"]),
    body("receiverId").if(body("transactionType").equals("transfer")).notEmpty(),
  ]),
  createTransaction
);

router.get("/", authenticate, getTransactions);

router.put(
  "/:id",
  authenticate,
  validateInput([
    param("id").isMongoId(),
    body("status").isIn(["pending", "completed", "failed"]),
  ]),
  updateTransactionStatus
);

module.exports = router;