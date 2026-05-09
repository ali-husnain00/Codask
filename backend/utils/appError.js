class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = "INTERNAL_ERROR", details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

export default AppError;
