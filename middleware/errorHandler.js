const multer = require("multer");
const { error } = require("node:console");

const isProd = process.env.NODE_ENV === "production";

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";


  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      statusCode = 400;
      message = "File too large (max 5MB)";
    } else {
      statusCode = 400;
      message = err.message;
    }
  }

  const isDuplicate =
    err?.code === 11000 ||
    err?.name === "MongoServerError" ||
    err?.errorType === "MongoServerError" ||
    (typeof err?.message === "string" && err.message.includes("E11000")) ||
    (typeof err?.stack === "string" && err.stack.includes("E11000"));

  if (isDuplicate) {  
    statusCode = 409;
    console.log("Hitting")

    const field = Object.keys(err.keyValue || {})[0] ;
    const fieldName = field?.charAt(0).toUpperCase() + field?.slice(1);

    message = `${fieldName} already exists`;
  }

  // Validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }
  console.error("🔥 ERROR:", err);

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};


module.exports = {
  notFound,
  errorHandler,
};
