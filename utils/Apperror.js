class AppError extends Error {
    constructor(message, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  module.exports = AppError;
  

//   use Apperror

// 400 Bad Request

// 401 Unauthorized

// 403 Forbidden

// 404 Not Found (for resources)

// 409 Duplicate / conflict

// 422 Validation you manually check