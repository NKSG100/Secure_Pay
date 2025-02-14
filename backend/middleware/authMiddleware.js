const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded user payload to the request object
    req.user = decoded.user; // Ensure this matches the payload structure
    console.log(req.user);
    // Log the authenticated user (for debugging purposes)
    console.log("Authenticated User:", req.user);

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token Verification Error:", err); // Log the error for debugging

    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token" });
    }

    // Handle other errors
    return res.status(401).json({ msg: "Token is not valid" });
  }
};