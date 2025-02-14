const errorMiddleware = (err, req, res, next) => {
  // Determine the status code and error message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server Error";

  // Log the error for debugging purposes
  console.error("Error:", {
    statusCode,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
    path: req.path,
    method: req.method,
  });

  // Send the error response
  res.status(statusCode).json({
    success: false, // Indicate that the request failed
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null, // Include stack trace in development
  });
};

module.exports = errorMiddleware;