// Express-specific middleware function

const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Missing token" });
    }

    try {
        // Was this JWT created using my secret, and is it still valid?
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        // Copy payload.role onto req.role
        req.role = payload.role || "USER";
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token"});
    }
}

module.exports = auth;


// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
// jwt.verify throws if the token is expired or signed with the wrong secret.
