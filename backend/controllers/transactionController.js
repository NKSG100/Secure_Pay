const Transaction = require("../models/Transaction");
const User = require("../models/User");

const createTransaction = async (req, res) => {
  const { receiverId, amount, transactionType } = req.body;

  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ msg: "Receiver not found" });
    }

    const sender = await User.findById(req.user.id);
    if (!sender) {
      return res.status(404).json({ msg: "Sender not found" });
    }

    if (amount <= 0) {
      return res.status(400).json({ msg: "Amount must be greater than 0" });
    }

    if (transactionType === "deposit") {
      receiver.balance += amount;
    } else if (transactionType === "withdrawal") {
      if (sender.balance < amount) {
        return res.status(400).json({ msg: "Insufficient balance" });
      }
      sender.balance -= amount;
    } else if (transactionType === "transfer") {
      if (sender.balance < amount) {
        return res.status(400).json({ msg: "Insufficient balance" });
      }
      sender.balance -= amount;
      receiver.balance += amount;
    } else {
      return res.status(400).json({ msg: "Invalid transaction type" });
    }

    await sender.save();
    await receiver.save();

    const newTransaction = new Transaction({
      sender: req.user.id,
      receiver: receiverId,
      amount,
      transactionType,
      status: "completed",
    });

    await newTransaction.save();

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error("Transaction Creation Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

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

const updateTransactionStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    if (transaction.sender.toString() !== req.user.id) {
      return res.status(403).json({ msg: "You are not authorized to update this transaction" });
    }

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