// Reads req.role - Use after auth(). Only continues if the token's role is allowed.
function requireRole(...roles) {
  return function (req, res, next) {
    // If role on request not the role needed e.g. admin
    if (!roles.includes(req.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

module.exports = requireRole;
