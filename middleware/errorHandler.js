function errorHandler(err, req, res, next) {
  // Req body not valid json
  if (err.type === "entity.parse.failed" || (err instanceof SyntaxError && err.status === 400)) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "CastError") {
    if (err.path === "_id") {
      return res.status(400).json({ error: "Invalid id" });
    }
    return res.status(400).json({ error: `Invalid ${err.path}` }); // e.g. age, breed
  }
  if (err.code === 11000) { // duplicate code
    return res.status(409).json({ error: "Already exists" });
  }
  console.error(err);
  res.status(500).json({ error: "Server error" });
}

module.exports = errorHandler;
