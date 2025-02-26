import React, { useState, useEffect } from "react";
import { getToken, getUserFromToken } from "../utils/auth";
import { motion } from "framer-motion";
import { CopyToClipboard } from "react-copy-to-clipboard";

const DashboardPage = () => {
  const [formData, setFormData] = useState({
    receiverId: "",
    amount: "",
    transactionType: "transfer",
  });

  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0);
  const [copied, setCopied] = useState(false);
  const user = getUserFromToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsResponse = await fetch("http://localhost:5000/api/transactions", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!transactionsResponse.ok) {
          throw new Error(`Failed to fetch transactions: ${transactionsResponse.statusText}`);
        }

        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);

        const userResponse = await fetch(`http://localhost:5000/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
        }

        const userData = await userResponse.json();
        setBalance(userData.balance);
      } catch (err) {
        console.error(err);
        setError("An error occurred. Please try again.");
      }
    };

    fetchData();
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount)) {
        setError("Please enter a valid amount.");
        return;
      }

      if (
        (formData.transactionType === "withdrawal" || formData.transactionType === "transfer") &&
        balance < amount
      ) {
        alert("Insufficient balance.");
        return;
      }

      const payload = {
        amount: amount,
        transactionType: formData.transactionType,
      };

      if (formData.transactionType === "deposit" || formData.transactionType === "withdrawal") {
        payload.receiverId = user.id;
      } else if (formData.transactionType === "transfer") {
        if (!formData.receiverId) {
          setError("Receiver ID is required for transfers.");
          return;
        }
        payload.receiverId = formData.receiverId;
      }

      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setTransactions([data, ...transactions]);

        if (formData.transactionType === "deposit") {
          setBalance(balance + amount);
        } else if (formData.transactionType === "withdrawal") {
          setBalance(balance - amount);
        } else if (formData.transactionType === "transfer") {
          setBalance(balance - amount);
        }

        setFormData({ receiverId: "", amount: "", transactionType: "transfer" });
        setError("");
        alert("Transaction successful!");
      } else {
        setError(data.msg || "Transaction failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl rounded-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Dashboard</h1>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-lg mb-2 text-gray-700">
          Balance: <span className="font-semibold text-green-600">₹{balance.toFixed(2)}</span>
        </p>
        <div className="flex items-center gap-2">
          <p className="text-lg text-gray-700">
            Account Number: <span className="font-semibold">{user?.id}</span>
          </p>
          <CopyToClipboard text={user?.id} onCopy={() => setCopied(true)}>
            <button
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
              title="Copy to Clipboard"
            >
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </CopyToClipboard>
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Send Money</h2>
        <form onSubmit={handleSendMoney} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Transaction Type</label>
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="transfer">Transfer</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
          </div>

          {formData.transactionType === "transfer" && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Enter Receiver ID</label>
              <input
                type="text"
                name="receiverId"
                value={formData.receiverId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Transaction History</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-300 text-left">Date</th>
              <th className="p-2 border border-gray-300 text-left">Description</th>
              <th className="p-2 border border-gray-300 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50 transition-all">
                  <td className="p-2 border border-gray-300">
                    {transaction.date ? new Date(transaction.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-2 border border-gray-300">{transaction.transactionType}</td>
                  <td className="p-2 border border-gray-300">₹{transaction.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-2 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DashboardPage;