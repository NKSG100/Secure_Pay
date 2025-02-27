# Secure_Pay
A full-stack money transfer application built with **React** (frontend), **Node.js** (backend), and **MongoDB** (database). This application allows users to register, log in, perform transactions (deposit, withdrawal, transfer), and view their transaction history.

---

## Features

- **User Authentication**:
  - Secure user registration and login using JWT (JSON Web Tokens).
  - Session-based authentication (logout on tab close).

- **Transactions**:
  - Deposit, withdraw, and transfer money.
  - View transaction history with details like date, type, and amount.

- **User Dashboard**:
  - View account balance.
  - Copy account number to clipboard.

- **Responsive Design**:
  - Modern and futuristic UI built with **Tailwind CSS**.
  - Fully responsive for all screen sizes.

---

## Technologies Used

### Frontend:
- **React.js** - JavaScript library for building the user interface.
- **Tailwind CSS** - Utility-first CSS framework for styling.
- **React Router** - For client-side routing.
- **Framer Motion** - For animations and transitions.

### Backend:
- **Node.js** - JavaScript runtime for the backend.
- **Express.js** - Web framework for building RESTful APIs.
- **MongoDB** - NoSQL database for storing user and transaction data.
- **Mongoose** - MongoDB object modeling for Node.js.
- **JWT** - For secure user authentication.

### Tools:
- **Git** - Version control system.
- **VSCode** - Code editor.
- **Postman** - API testing tool.

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Steps to Run the Project

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/NKSG100/Secure_Pay.git
   cd Secure_Pay
   ```

2. **Install Dependencies**:
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the `backend` directory and add the following:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```

4. **Run the Backend**:
   ```bash
   cd backend
   npm start
   ```

5. **Run the Frontend**:
   ```bash
   cd ../frontend
   npm start
   ```

6. **Access the Application**:
   - Open your browser and go to `http://localhost:3000`.

---

## Screenshots

### Sign In Page
![Sign In Page](./screenshots/signin.png)

### Dashboard Page
![Dashboard Page](./screenshots/dashboard.png)

### Transaction History
![Transaction History](./screenshots/transactions.png)

---

## Folder Structure

```
money-transfer-app/
├── backend/
│   ├── controllers/       # Backend controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── server.js          # Backend entry point
│   └── .env               # Environment variables
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Application pages
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main application component
│   │   └── index.js       # Frontend entry point
│   └── package.json       # Frontend dependencies
└── README.md              # Project documentation
```
