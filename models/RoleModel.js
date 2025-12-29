const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ["superadmin", "salon_owner", "stylist", "customer", "receptionist", "support"],
    },
    displayName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    permissions: [{
        type: String,
        // Array of permission names (e.g., ["salon:edit", "stylist:create"])
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update timestamp on save
RoleSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const RoleModel = mongoose.model("Role", RoleSchema);

module.exports = { RoleModel };
