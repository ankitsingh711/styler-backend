const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    email: String,
    name: String,
    mob_no: Number,
    gender: String,
    city: String,
    password: String,
    profilePicture: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: ["superadmin", "salon_owner", "stylist", "customer", "receptionist", "support", "user"],
      default: "customer"
    },
    // Custom permissions (in addition to role-based permissions)
    customPermissions: [{
      type: String,
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const UserModel = new mongoose.model("Registered_User", UserSchema);
module.exports = { UserModel };
