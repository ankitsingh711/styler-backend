const jwt = require("jsonwebtoken");
const client = require("../config/redis");
const fs = require("fs");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send({ "msg": "No token provided. Please login first." });
        }

        // Extract token from "Bearer <token>" format
        let token;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove "Bearer " prefix
        } else {
            token = authHeader;
        }

        console.log("Token received:", token);

        // Check if token is in blacklist
        const blacklist = fs.readFileSync("./blacklist.json", { encoding: "utf-8" });
        if (blacklist.includes(token)) {
            return res.status(401).send({ "msg": "Token is invalid. Please login again." });
        }

        // Verify token
        const decoded = jwt.verify(token, "9168");

        if (decoded) {
            console.log("Decoded token:", decoded);
            req.body.userID = decoded.userID;
            req.body.role = decoded.role;
            next();
        } else {
            return res.status(401).send({ "msg": "Invalid token. Please login first." });
        }
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).send({ "msg": "Authentication failed. Please login first." });
    }
}

module.exports = {
    authenticate
}