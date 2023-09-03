const globalError = (err, req, res, next) => {
  if (process.env.NODE_ENV === "devlopment") {
    res.status(err.statusCode || 500).json({
      status: err.status || "error",
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  }
};

module.exports = globalError;
