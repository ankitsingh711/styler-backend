const jwt = require("jsonwebtoken");
require("dotenv").config();

// JWT Secret Keys from environment variables
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "your-access-secret-key-change-in-production";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production";

// Token expiry times
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

/**
 * Generate Access Token
 * @param {Object} payload - User data to encode in token
 * @returns {String} - JWT access token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY
    });
};

/**
 * Generate Refresh Token
 * @param {Object} payload - User data to encode in token
 * @returns {String} - JWT refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY
    });
};

/**
 * Verify Access Token
 * @param {String} token - JWT access token
 * @returns {Object} - Decoded token payload
 */
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new Error("Invalid or expired access token");
    }
};

/**
 * Verify Refresh Token
 * @param {String} token - JWT refresh token
 * @returns {Object} - Decoded token payload
 */
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
};

/**
 * Generate both tokens
 * @param {Object} payload - User data
 * @returns {Object} - Both access and refresh tokens
 */
const generateTokenPair = (payload) => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    return {
        accessToken,
        refreshToken
    };
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateTokenPair
};
