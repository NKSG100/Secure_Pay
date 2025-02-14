const Transaction = require("../models/Transaction");
const User = require("../models/User");

// @desc    Create a new transaction (deposit, withdrawal, or transfer)
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  const { receiverId, amount, transactionType } = req.body;

  try {
    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ msg: "Receiver not found" });
    }

    // Get sender details
    const sender = await User.findById(req.user.id);
    if (!sender) {
      return res.status(404).json({ msg: "Sender not found" });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ msg: "Amount must be greater than 0" });
    }

    // Handle transaction types
    if (transactionType === "deposit") {
      // Deposit: Add amount to receiver's balance
      receiver.balance += amount;
    } else if (transactionType === "withdrawal") {
      // Withdrawal: Deduct amount from sender's balance
      if (sender.balance < amount) {
        return res.status(400).json({ msg: "Insufficient balance" });
      }
      sender.balance -= amount;
    } else if (transactionType === "transfer") {
      // Transfer: Deduct from sender and add to receiver
      if (sender.balance < amount) {
        return res.status(400).json({ msg: "Insufficient balance" });
      }
      sender.balance -= amount;
      receiver.balance += amount;
    } else {
      return res.status(400).json({ msg: "Invalid transaction type" });
    }

    // Save updated balances
    await sender.save();
    await receiver.save();

    // Create transaction
    const newTransaction = new Transaction({
      sender: req.user.id,
      receiver: receiverId,
      amount,
      transactionType,
      status: "completed", // Mark as completed after balance updates
    });

    await newTransaction.save();

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error("Transaction Creation Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Get all transactions of a user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    }).populate("sender receiver", "username email");

    res.status(200).json(transactions);
  } catch (err) {
    console.error("Fetch Transactions Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Update transaction status
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransactionStatus = async (req, res) => {
  const { status } = req.body;

  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    // Only allow the sender or admin to update the status
    if (transaction.sender.toString() !== req.user.id) {
      return res.status(403).json({ msg: "You are not authorized to update this transaction" });
    }

    // Validate status
    if (!["pending", "completed", "failed"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json(transaction);
  } catch (err) {
    console.error("Update Transaction Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransactionStatus,
};