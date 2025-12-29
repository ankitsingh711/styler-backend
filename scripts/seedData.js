// Script to populate sample stylists and services
require("dotenv").config();
const mongoose = require("mongoose");
const { StylerModel } = require("../Model/StylerModel");
const { StylesModel } = require("../Model/Styles");

const { db } = require("../config/db");

// MongoDB connection (will use the existing connection)

const sampleStylers = [
    {
        Styler_name: "John Rivera",
        mob_no: 9876543210,
        city: "Mumbai",
        salary: 35000,
        email: "john.rivera@styler.com",
        specialization: "Hair Specialist"
    },
    {
        Styler_name: "Sarah Mitchell",
        mob_no: 9876543211,
        city: "Mumbai",
        salary: 40000,
        email: "sarah.mitchell@styler.com",
        specialization: "Beard Expert"
    },
    {
        Styler_name: "David Kumar",
        mob_no: 9876543212,
        city: "Mumbai",
        salary: 38000,
        email: "david.kumar@styler.com",
        specialization: "Hair & Beard Specialist"
    }
];

const sampleServices = [
    {
        name: "Classic Haircut",
        image: "https://images.unsplash.com/photo-1622286346003-c68d6a3c8f94?w=400",
        category: "Haircut",
        price: 300,
        ForGender: "Male"
    },
    {
        name: "Premium Haircut & Styling",
        image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400",
        category: "Haircut",
        price: 500,
        ForGender: "Male"
    },
    {
        name: "Beard Trim & Shaping",
        image: "https://images.unsplash.com/photo-1621607512173-61b3d5d4e3bb?w=400",
        category: "Beard",
        price: 200,
        ForGender: "Male"
    },
    {
        name: "Royal Shave",
        image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400",
        category: "Shave",
        price: 250,
        ForGender: "Male"
    },
    {
        name: "Hair Color",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
        category: "Color",
        price: 1500,
        ForGender: "Male"
    },
    {
        name: "Complete Grooming Package",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
        category: "Package",
        price: 800,
        ForGender: "Male"
    }
];

async function populateData() {
    try {
        await db;
        console.log("✅ Connected to MongoDB");

        // Clear existing data
        await StylerModel.deleteMany({});
        await StylesModel.deleteMany({});
        console.log("🗑️  Cleared existing data");

        // Insert sample stylists
        const stylists = await StylerModel.insertMany(sampleStylers);
        console.log(`✨ Added ${stylists.length} stylists`);

        // Insert sample services
        const services = await StylesModel.insertMany(sampleServices);
        console.log(`✨ Added ${services.length} services`);

        console.log("\n✅ Sample data populated successfully!");
        console.log("\nStylers:");
        stylists.forEach(s => console.log(`  - ${s.Styler_name} (${s.specialization})`));
        console.log("\nServices:");
        services.forEach(s => console.log(`  - ${s.name} - ₹${s.price}`));

        process.exit(0);
    } catch (error) {
        console.error("❌ Error populating data:", error);
        process.exit(1);
    }
}

populateData();
