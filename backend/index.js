const express = require("express");
const cors = require("cors");
const { UserRouter } = require("./routes/UserRouter");
const { AdminRouter } = require("./routes/AdminRouter");
const { connection } = require("./config/db");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration - Allow requests from React app
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Styler API Server",
        status: "Running",
        version: "2.0.0 (MERN)"
    });
});

app.use("/user", UserRouter);
app.use("/admin", AdminRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 9168;

app.listen(PORT, async () => {
    try {
        await connection;
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`🎉 Connected to MongoDB`);
        console.log(`🌐 API URL: http://localhost:${PORT}`);
    } catch (error) {
        console.log("❌ Database Connection Error:", error.message);
        process.exit(1);
    }
});