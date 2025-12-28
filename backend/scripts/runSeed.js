// Script to seed roles and permissions
const { connection } = require("../config/db");
const { seedPermissions } = require("./seedPermissions");

async function runSeed() {
    try {
        // Connect to MongoDB using existing connection
        await connection;
        console.log("✅ Connected to MongoDB");

        // Run seed
        await seedPermissions();

        console.log("✅ Seeding complete, you can now stop the script");

    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

runSeed();
