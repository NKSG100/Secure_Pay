const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server Error";

  console.error("Error:", {
    statusCode,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;