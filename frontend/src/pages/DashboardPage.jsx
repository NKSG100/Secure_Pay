import React, { useState, useEffect } from "react";
import { getToken, getUserFromToken } from "../utils/auth";

const DashboardPage = () => {
  const [formData, setFormData] = useState({
    receiverId: "",
    amount: "",
    transactionType: "transfer", // Default transaction type
  });

  const [friendId, setFriendId] = useState(""); // For adding a friend
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0); // Track user balance
  const [friends, setFriends] = useState([]); // List of friends
  const user = getUserFromToken(); // Get authenticated user details

  // Fetch transactions, user balance, and friends on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const transactionsResponse = await fetch("http://localhost:5000/api/transactions", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const transactionsData = await transactionsResponse.json();
        if (transactionsResponse.ok) {
          setTransactions(transactionsData);
        } else {
          setError(transactionsData.msg || "Failed to fetch transactions.");
        }

        // Fetch user balance
        const userResponse = await fetch(`http://localhost:5000/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const userData = await userResponse.json();
        if (userResponse.ok) {
          setBalance(userData.balance);
        } else {
          setError(userData.msg || "Failed to fetch user balance.");
        }

        // Fetch friends
        const friendsResponse = await fetch("http://localhost:5000/api/users/friends", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        console.log(getToken());
        if (friendsResponse.ok) {
          const friendsData = await friendsResponse.json();
          setFriends(friendsData);
        } else {
          setError("Failed to fetch friends 2");
        }
      } catch (err) {
        alert(err);
        setError("An error occurred. Please try again 3.");
      }
    };

    fetchData();
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ friendId }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setFriends(data.friends); // Update the friends list
        setFriendId(""); // Clear the input field
        alert("Friend added successfully!");
      } else {
        setError(data.message || "Failed to add friend.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();

    try {
      // Validate amount
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        setError("Please enter a valid amount.");
        return;
      }

      // Check balance for withdrawal or transfer
      if (
        (formData.transactionType === "withdrawal" || formData.transactionType === "transfer") &&
        balance < amount
      ) {
        alert("Insufficient balance.");
        return;
      }

      // Prepare the payload based on the transaction type
      const payload = {
        amount: amount,
        transactionType: formData.transactionType,
      };

      // Set receiverId for deposit and withdrawal (current user's ID)
      if (formData.transactionType === "deposit" || formData.transactionType === "withdrawal") {
        payload.receiverId = user.id; // Use current user's ID
      } else if (formData.transactionType === "transfer") {
        // For transfers, use the provided receiverId
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
        setTransactions([data, ...transactions]); // Add new transaction to the list

        // Update balance based on transaction type
        if (formData.transactionType === "deposit") {
          setBalance(balance + amount); // Add to balance for deposit
        } else if (formData.transactionType === "withdrawal") {
          setBalance(balance - amount); // Subtract from balance for withdrawal
        } else if (formData.transactionType === "transfer") {
          setBalance(balance - amount); // Subtract from balance for transfer
        }

        setFormData({ receiverId: "", amount: "", transactionType: "transfer" }); // Reset form
        setError(""); // Clear any previous errors
        alert("Transaction successful!");
      } else {
        setError(data.msg || "Transaction failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };
  console.log("****");
  console.log(user);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <main className="flex-grow container mx-auto px-6 py-10">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
          Dashboard
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
          Check your Transaction History and Manage your Payments.
        </p>

        {/* Balance Display */}
        <div className="bg-gray-800 shadow-lg rounded-xl p-8 mb-10 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-semibold text-gray-200 mb-6">Your Balance:</h3>
          <p className="text-4xl font-bold text-blue-400">₹{balance.toFixed(2)}</p><br></br>
          <h5 className="text-2xl font-semibold text-gray-200 mb-6">Account Number: </h5>
          <p className="text-xl font-bold text-blue-400">{user?.id}</p>
        </div>

        {/* Add Friend Section */}
        <section className="bg-gray-800 shadow-lg rounded-xl p-8 mb-10 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-semibold text-gray-200 mb-6">Add Friend</h3>
          <form onSubmit={handleAddFriend} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Friend ID</label>
              <input
                type="text"
                value={friendId}
                onChange={(e) => setFriendId(e.target.value)}
                required
                className="w-full p-4 mt-2 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
            >
              Add Friend
            </button>
          </form>
        </section>

        {/* Send Money Form */}
        <section className="bg-gray-800 shadow-lg rounded-xl p-8 mb-10 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-semibold text-gray-200 mb-6">Send Money</h3>
          <form onSubmit={handleSendMoney} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Transaction Type</label>
              <select
                name="transactionType"
                value={formData.transactionType}
                onChange={handleInputChange}
                className="w-full p-4 mt-2 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
              >
                <option value="transfer">Transfer</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
              </select>
            </div>

            {/* Receiver ID Field (Only for Transfer) */}
            {formData.transactionType === "transfer" && (
              <div>
                <label className="block text-sm font-medium text-gray-300">Select Friend</label>
                <select
                  name="receiverId"
                  value={formData.receiverId}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 mt-2 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                >
                  <option value="" disabled>Select a friend</option>
                </select>
              </div>
            )}

            {/* Amount Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                className="w-full p-4 mt-2 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
              />
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 text-center">{error}</div>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
            >
              Submit
            </button>
          </form>
        </section>

        {/* Transaction History Table */}
        <section className="bg-gray-800 shadow-lg rounded-xl p-8 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-semibold text-gray-200 mb-6">Transaction History</h3>
          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium">Description</th>
                <th className="text-right py-4 px-6 text-sm font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-t border-gray-600 hover:bg-gray-600">
                  <td className="py-4 px-6 text-sm text-gray-200">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-sm text-gray-200">{transaction.transactionType}</td>
                  <td className="py-4 px-6 text-sm text-gray-200 text-right">₹{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;