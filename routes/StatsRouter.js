const express = require("express");
const { UserModel } = require("../models/UserModel");
const { StylerModel } = require("../models/StylerModel");
const { AppointmentModel } = require("../models/AppointmentModel");

const StatsRouter = express.Router();

// Cache for stats (5 minutes)
let statsCache = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * GET /stats/overview
 * Returns aggregated statistics for the home page
 */
StatsRouter.get("/overview", async (req, res) => {
    try {
        // Check if cache is valid
        const now = Date.now();
        if (statsCache && cacheTime && (now - cacheTime) < CACHE_DURATION) {
            return res.json({
                success: true,
                data: statsCache,
                cached: true
            });
        }

        // Get current date for trend calculations
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Calculate previous month
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        // Parallel database queries for better performance
        const [
            totalUsers,
            totalStylists,
            totalAppointments,
            currentMonthUsers,
            previousMonthUsers,
            currentMonthAppointments,
            previousMonthAppointments
        ] = await Promise.all([
            UserModel.countDocuments(),
            StylerModel.countDocuments(),
            AppointmentModel.countDocuments(),
            // Current month users (for trend calculation)
            UserModel.countDocuments({
                createdAt: {
                    $gte: new Date(currentYear, currentMonth, 1),
                    $lt: new Date(currentYear, currentMonth + 1, 1)
                }
            }),
            // Previous month users
            UserModel.countDocuments({
                createdAt: {
                    $gte: new Date(previousYear, previousMonth, 1),
                    $lt: new Date(previousYear, previousMonth + 1, 1)
                }
            }),
            // Current month appointments
            AppointmentModel.countDocuments({
                createdAt: {
                    $gte: new Date(currentYear, currentMonth, 1),
                    $lt: new Date(currentYear, currentMonth + 1, 1)
                }
            }),
            // Previous month appointments
            AppointmentModel.countDocuments({
                createdAt: {
                    $gte: new Date(previousYear, previousMonth, 1),
                    $lt: new Date(previousYear, previousMonth + 1, 1)
                }
            })
        ]);

        // Calculate trends (percentage growth)
        const calculateTrend = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        const usersTrend = calculateTrend(currentMonthUsers, previousMonthUsers);
        const appointmentsTrend = calculateTrend(currentMonthAppointments, previousMonthAppointments);

        // Prepare stats data
        const stats = {
            stats: [
                {
                    title: "Branches",
                    count: 162, // Fixed value, update if you have dynamic branches
                    trend: 12,
                    icon: "location"
                },
                {
                    title: "Happy Clients",
                    count: totalUsers,
                    trend: usersTrend,
                    icon: "star"
                },
                {
                    title: "Expert Stylists",
                    count: totalStylists,
                    trend: 5, // Can be calculated if you track stylist additions
                    icon: "scissors"
                },
                {
                    title: "Total Appointments",
                    count: totalAppointments,
                    trend: appointmentsTrend,
                    icon: "calendar"
                },
                {
                    title: "Customer Satisfaction",
                    count: 98, // Percentage - can be calculated from reviews/ratings
                    trend: 2,
                    icon: "heart"
                },
                {
                    title: "Years in Business",
                    count: 15,
                    trend: 0, // No trend for years
                    icon: "trophy"
                }
            ],
            lastUpdated: new Date().toISOString()
        };

        // Update cache
        statsCache = stats;
        cacheTime = now;

        res.json({
            success: true,
            data: stats,
            cached: false
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: error.message
        });
    }
});

/**
 * POST /stats/clear-cache
 * Clears the stats cache (admin only - add auth middleware if needed)
 */
StatsRouter.post("/clear-cache", (req, res) => {
    statsCache = null;
    cacheTime = null;
    res.json({
        success: true,
        message: "Stats cache cleared"
    });
});

module.exports = { StatsRouter };
