const { RoleModel } = require("../models/RoleModel");
const { PermissionModel } = require("../models/PermissionModel");

/**
 * Seed initial roles and permissions into the database
 * Run this script once to populate the database
 */

const permissions = [
    // Salon permissions
    { name: "salon:view", description: "View salon details", resource: "salon", action: "view" },
    { name: "salon:create", description: "Create new salon", resource: "salon", action: "create" },
    { name: "salon:edit", description: "Edit salon details", resource: "salon", action: "edit" },
    { name: "salon:delete", description: "Delete salon", resource: "salon", action: "delete" },

    // Stylist permissions
    { name: "stylist:view", description: "View stylist details", resource: "stylist", action: "view" },
    { name: "stylist:create", description: "Create new stylist", resource: "stylist", action: "create" },
    { name: "stylist:update", description: "Update stylist details", resource: "stylist", action: "update" },
    { name: "stylist:delete", description: "Delete stylist", resource: "stylist", action: "delete" },
    { name: "stylist:profile:update", description: "Update own stylist profile", resource: "stylist", action: "profile:update" },

    // Service permissions
    { name: "service:view", description: "View services", resource: "service", action: "view" },
    { name: "service:manage", description: "Manage services", resource: "service", action: "manage" },

    // Booking permissions
    { name: "booking:view", description: "View all bookings", resource: "booking", action: "view" },
    { name: "booking:view:self", description: "View own bookings", resource: "booking", action: "view:self" },
    { name: "booking:create", description: "Create booking", resource: "booking", action: "create" },
    { name: "booking:update", description: "Update booking", resource: "booking", action: "update" },
    { name: "booking:cancel:self", description: "Cancel own booking", resource: "booking", action: "cancel:self" },
    { name: "booking:assign", description: "Assign bookings to stylists", resource: "booking", action: "assign" },
    { name: "booking:status:update", description: "Update booking status", resource: "booking", action: "status:update" },

    // Payment permissions
    { name: "payment:view", description: "View payments", resource: "payment", action: "view" },
    { name: "payment:make", description: "Make payment", resource: "payment", action: "make" },
    { name: "payment:cash", description: "Handle cash payments", resource: "payment", action: "cash" },
    { name: "payout:view", description: "View payouts", resource: "payout", action: "view" },

    // Review permissions
    { name: "review:create", description: "Create review", resource: "review", action: "create" },
    { name: "review:view", description: "View reviews", resource: "review", action: "view" },
    { name: "review:moderate", description: "Moderate reviews", resource: "review", action: "moderate" },

    // Customer permissions
    { name: "customer:view", description: "View customer details", resource: "customer", action: "view" },
    { name: "customer:manage", description: "Manage customers", resource: "customer", action: "manage" },

    // User permissions
    { name: "user:view", description: "View user details", resource: "user", action: "view" },
    { name: "user:manage", description: "Manage users", resource: "user", action: "manage" },

    // Availability permissions
    { name: "availability:manage", description: "Manage availability", resource: "availability", action: "manage" },

    // Earnings permissions
    { name: "earnings:view", description: "View earnings", resource: "earnings", action: "view" },

    // Ticket permissions
    { name: "ticket:view", description: "View support tickets", resource: "ticket", action: "view" },
    { name: "ticket:update", description: "Update support tickets", resource: "ticket", action: "update" },

    // Reports permissions
    { name: "reports:view", description: "View platform reports", resource: "reports", action: "view" },

    // Roles permissions
    { name: "roles:manage", description: "Manage roles and permissions", resource: "roles", action: "manage" },
];

const roles = [
    {
        name: "superadmin",
        displayName: "Super Admin",
        description: "Platform owner with full access",
        permissions: [
            "salon:view", "salon:create", "salon:edit", "salon:delete",
            "stylist:view", "stylist:create", "stylist:update", "stylist:delete",
            "service:view", "service:manage",
            "booking:view", "booking:create", "booking:update", "booking:assign",
            "payment:view", "payment:cash", "payout:view",
            "review:view", "review:moderate",
            "customer:view", "customer:manage",
            "user:view", "user:manage",
            "reports:view",
            "roles:manage"
        ]
    },
    {
        name: "salon_owner",
        displayName: "Salon Owner",
        description: "Owner of a salon or chain",
        permissions: [
            "salon:view", "salon:edit",
            "stylist:view", "stylist:create", "stylist:update",
            "service:view", "service:manage",
            "booking:view", "booking:assign",
            "payout:view"
        ]
    },
    {
        name: "stylist",
        displayName: "Stylist / Barber",
        description: "Provides grooming services",
        permissions: [
            "stylist:profile:update",
            "availability:manage",
            "booking:view:self",
            "booking:status:update",
            "earnings:view"
        ]
    },
    {
        name: "customer",
        displayName: "Customer / Client",
        description: "Books services and makes appointments",
        permissions: [
            "booking:create",
            "booking:view:self",
            "booking:cancel:self",
            "payment:make",
            "review:create"
        ]
    },
    {
        name: "receptionist",
        displayName: "Receptionist / Front Desk",
        description: "Handles in-salon bookings",
        permissions: [
            "booking:create",
            "booking:update",
            "booking:view",
            "payment:cash"
        ]
    },
    {
        name: "support",
        displayName: "Support / Moderator",
        description: "Handles support and moderation",
        permissions: [
            "ticket:view",
            "ticket:update",
            "review:moderate",
            "user:view"
        ]
    }
];

async function seedPermissions() {
    try {
        console.log("🌱 Starting permission and role seeding...");

        // Clear existing permissions and roles
        await PermissionModel.deleteMany({});
        await RoleModel.deleteMany({});
        console.log("✅ Cleared existing permissions and roles");

        // Insert permissions
        const insertedPermissions = await PermissionModel.insertMany(permissions);
        console.log(`✅ Inserted ${insertedPermissions.length} permissions`);

        // Insert roles
        const insertedRoles = await RoleModel.insertMany(roles);
        console.log(`✅ Inserted ${insertedRoles.length} roles`);

        console.log("\n📋 Roles created:");
        insertedRoles.forEach(role => {
            console.log(`  - ${role.displayName} (${role.name}): ${role.permissions.length} permissions`);
        });

        console.log("\n✨ Seeding completed successfully!");

    } catch (error) {
        console.error("❌ Error seeding permissions and roles:", error);
        throw error;
    }
}

module.exports = { seedPermissions };
