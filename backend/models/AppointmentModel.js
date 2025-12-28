const mongoose = require("mongoose");
const AppointmentSchema = mongoose.Schema(
  {
    UserID: String,
    StylistID: String,
    Stylistname: String,
    serviceId: String, // Service selected for the appointment
    date: String,
    slot: String,
    status: { type: String, enum: ["Pending", "Complete", "Apporved", "Cancel"], default: "Pending" },
  }
);

const AppointmentModel = new mongoose.model("Appointment_Details", AppointmentSchema);

module.exports = { AppointmentModel };
