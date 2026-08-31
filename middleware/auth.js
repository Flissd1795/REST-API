// Express-specific middleware function

const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ error: "Missing token" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token"});
    }
}

module.exports = auth;


// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
// jwt.verify throws if the token is expired or signed with the wrong secret.
