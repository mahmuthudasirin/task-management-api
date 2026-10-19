function errorHandler(err, req, res, next) {
  const isProduction = process.env.NODE_ENV === "production";
  let statusCode = err.statusCode || 500;
  let message = err.message || "Sunucu hatası";

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Geçersiz JSON gövdesi";
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details || undefined,
    stack: isProduction ? undefined : err.stack,
  });
}

module.exports = { errorHandler };
