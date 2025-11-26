const fs = require("fs");
const path = require("path");
const { verifyAccessToken } = require("../utils/jwtHelper");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if authorization header exists
        if (!authHeader) {
            return res.status(401).json({ 
                success: false,
                message: "No token provided. Please login first." 
            });
        }

        // Extract token from "Bearer <token>" format
        let token;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7).trim(); // Remove "Bearer " prefix
        } else {
            token = authHeader.trim();
        }

        // Validate token exists
        if (!token || token === 'undefined' || token === 'null') {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token format. Please login again." 
            });
        }

        console.log("Authenticating token...");

        // Check if token is in blacklist
        try {
            const blacklistPath = path.join(__dirname, "../blacklist.json");
            if (fs.existsSync(blacklistPath)) {
                const blacklist = JSON.parse(fs.readFileSync(blacklistPath, { encoding: "utf-8" }));
                if (blacklist.includes(token)) {
                    return res.status(401).json({ 
                        success: false,
                        message: "Token has been revoked. Please login again." 
                    });
                }
            }
        } catch (error) {
            console.error("Error reading blacklist:", error.message);
        }

        // Verify token
        const decoded = verifyAccessToken(token);

        if (decoded) {
            console.log("Token verified successfully for user:", decoded.userID);
            // Attach user info to request object
            req.user = {
                userID: decoded.userID,
                role: decoded.role,
                email: decoded.email
            };
            req.body.userID = decoded.userID;
            req.body.role = decoded.role;
            next();
        } else {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token. Please login first." 
            });
        }
    } catch (error) {
        console.error("Authentication error:", error.message);
        
        // Handle specific JWT errors
        if (error.message.includes("expired")) {
            return res.status(401).json({ 
                success: false,
                message: "Token has expired. Please login again.",
                code: "TOKEN_EXPIRED"
            });
        } else if (error.message.includes("invalid")) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token. Please login again.",
                code: "INVALID_TOKEN"
            });
        }
        
        return res.status(401).json({ 
            success: false,
            message: "Authentication failed. Please login first." 
        });
    }
};

module.exports = {
    authenticate
};