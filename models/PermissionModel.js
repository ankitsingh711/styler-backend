const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        // Format: resource:action (e.g., "salon:edit", "booking:create")
    },
    description: {
        type: String,
        required: true,
    },
    resource: {
        type: String,
        required: true,
        // e.g., "salon", "booking", "stylist", "customer"
    },
    action: {
        type: String,
        required: true,
        // e.g., "view", "create", "edit", "delete", "manage"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for faster lookups
PermissionSchema.index({ resource: 1, action: 1 });

const PermissionModel = mongoose.model("Permission", PermissionSchema);

module.exports = { PermissionModel };
