const express = require("express");
require("dotenv").config();
const { UserModel } = require("../models/UserModel");
const client = require("../config/redis");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const UserRouter = express.Router();
const { authenticate } = require("../middleware/Authentication");
const { StylerModel } = require("../models/StylerModel");
const { AppointmentModel } = require("../models/AppointmentModel");
const { BlockUserModel } = require("../models/BlockUserModel");
const otpvalidator = require("../config/OTP");
const { generateTokenPair, verifyRefreshToken } = require("../utils/jwtHelper");
const multer = require('multer');
const { uploadToS3, deleteFromS3 } = require('../config/s3');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});


const app = express()
app.use(express.json())

// **************REGISTER*****************
//******OPT */
UserRouter.get("/OTP", async (req, res) => {
    let payload = req.query;
    let check = await UserModel.find({ email: payload.email });
    if (check.length !== 0) {
        res.send({ "msg": "Email already registered" })
    } else {
        let OTP = otpvalidator(payload.email);
        res.send({ "OTP": OTP })
    }
})
UserRouter.post("/register", async (req, res) => {
    let payload = req.body;
    try {
        bcrypt.hash(payload.password, +2, async (err, hash) => {
            if (err) {
                res.send({ message: err.message });
            } else {
                payload.password = hash;
                payload.role = `customer`
                const User = new UserModel(payload);
                await User.save();
                res.send({ "message": `User Register Sucessfull` });
            }
        });
    } catch (error) {
        console.log({ message: error.message });
        res.send({ message: error.message });
    }

});


// **************LOGIN*****************

UserRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Check if email is blocked
        let blockmails = await BlockUserModel.find();
        let isBlocked = blockmails.some(blocked => blocked.Email === email);

        if (isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Email is blocked. Please contact support."
            });
        }

        // Find user
        let User = await UserModel.findOne({ email: email });

        if (!User) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please sign up first."
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, User.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Generate tokens
        const tokenPayload = {
            userID: User._id,
            role: User.role || 'user',
            email: User.email
        };

        const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

        console.log("Login successful for user:", email);

        // Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token: accessToken,
            refreshToken: refreshToken,
            username: User.name,
            email: User.email,
            profilePicture: User.profilePicture,
            userType: User.role || 'user'
        });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            success: false,
            message: "Login failed. Please try again.",
            error: error.message
        });
    }
});

// **************REFRESH TOKEN*****************
UserRouter.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required"
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        // Check if user still exists
        const user = await UserModel.findById(decoded.userID);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate new token pair
        const tokenPayload = {
            userID: user._id,
            role: user.role || 'user',
            email: user.email
        };

        const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(tokenPayload);

        res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            token: accessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        console.error("Refresh token error:", error.message);
        res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
            error: error.message
        });
    }
});

UserRouter.get("/userInfo", async (req, res) => {
    let search = req.query
    let data = await UserModel.find(search)
    res.send(data);
});

// Apply authentication middleware to all routes below this point
UserRouter.use(authenticate)
//*******Check avalibility ***********/
UserRouter.post("/Check", async (req, res) => {
    let { city, date, slot } = req.body;
    let data = await StylerModel.find({ "city": city });
    let data1 = await AppointmentModel.find({ date, slot });
    console.log(data1);
    for (i = 0; i < data1.length; i++) {
        data = data.filter((el) => {
            let id = String(el._id);
            console.log(id, data1[i].StylistID)
            if (id !== data1[i].StylistID) {
                return el;
            }
        })
    }
    if (data.length == 0) {
        res.send({ msg: "no slot avalibale" });
    } else {
        res.send(data);
    }
})
//********Book appointment**********/
UserRouter.post("/book", async (req, res) => {
    let payload = req.body;
    payload.status = "Pending";
    payload.slot.toLocaleLowerCase();
    let data = new AppointmentModel(payload);
    await data.save();
    res.send({ message: "Appointment booked" });
})

// ********** New Appointments Endpoint (Frontend Compatible) **********
UserRouter.post("/appointments", async (req, res) => {
    try {
        const { stylerId, serviceId, date, time } = req.body;
        const userId = req.userID; // From authenticate middleware

        // Validate required fields
        if (!stylerId || !serviceId || !date || !time) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: stylerId, serviceId, date, time"
            });
        }

        // Get styler details
        const styler = await StylerModel.findById(stylerId);
        if (!styler) {
            return res.status(404).json({
                success: false,
                message: "Styler not found"
            });
        }

        // Get service details
        const { StylesModel } = require("../models/Styles");
        const service = await StylesModel.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Create appointment with database field names
        const appointment = new AppointmentModel({
            UserID: userId,
            StylistID: stylerId,
            Stylistname: styler.Styler_name || styler.name || 'Unknown',
            date: date,
            slot: time,
            status: "Pending",
            serviceId: serviceId // Store service ID for reference
        });

        await appointment.save();

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: appointment
        });

    } catch (error) {
        console.error("Error booking appointment:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to book appointment. Please try again.",
            error: error.message
        });
    }
});

// Get user's appointments
UserRouter.get("/appointments", async (req, res) => {
    try {
        const userId = req.userID; // From authenticate middleware

        const appointments = await AppointmentModel.find({ UserID: userId });

        // Get StylesModel for service details
        const { StylesModel } = require("../models/Styles");

        // Populate styler and service details for each appointment
        const populatedAppointments = await Promise.all(
            appointments.map(async (appointment) => {
                // Get styler details
                let stylerDetails = null;
                if (appointment.StylistID) {
                    try {
                        const styler = await StylerModel.findById(appointment.StylistID);
                        if (styler) {
                            stylerDetails = {
                                _id: styler._id,
                                name: styler.Styler_name || styler.name || 'Unknown Styler'
                            };
                        }
                    } catch (err) {
                        console.error("Error fetching styler:", err);
                    }
                }

                // Get service details
                let serviceDetails = null;
                if (appointment.serviceId) {
                    try {
                        const service = await StylesModel.findById(appointment.serviceId);
                        if (service) {
                            serviceDetails = {
                                _id: service._id,
                                name: service.name
                            };
                        }
                    } catch (err) {
                        console.error("Error fetching service:", err);
                    }
                }

                // Return formatted appointment
                return {
                    _id: appointment._id,
                    styler: stylerDetails,
                    stylerName: appointment.Stylistname || stylerDetails?.name || 'N/A',
                    service: serviceDetails,
                    serviceName: serviceDetails?.name || 'N/A',
                    date: appointment.date,
                    time: appointment.slot, // Map 'slot' to 'time' for frontend compatibility
                    status: appointment.status || 'Pending'
                };
            })
        );

        res.status(200).json({
            success: true,
            data: populatedAppointments
        });
    } catch (error) {
        console.error("Error fetching appointments:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch appointments",
            error: error.message
        });
    }
});

// **************UPLOAD PROFILE PICTURE*****************
UserRouter.post("/upload-profile-picture", upload.single('profileImage'), async (req, res) => {
    try {
        // Authenticate middleware sets req.user
        const userId = req.user?.userID || req.userID;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found in request"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // Get user to check for existing profile picture
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Delete old profile picture from S3 if exists
        if (user.profilePicture) {
            try {
                await deleteFromS3(user.profilePicture);
            } catch (error) {
                console.error("Error deleting old profile picture:", error);
                // Continue even if deletion fails
            }
        }

        // Upload new picture to S3
        const fileUrl = await uploadToS3(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        // Update user's profile picture in database
        user.profilePicture = fileUrl;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            data: {
                profilePicture: fileUrl
            }
        });

    } catch (error) {
        console.error("Error uploading profile picture:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to upload profile picture",
            error: error.message
        });
    }
});

// Get current user profile
UserRouter.get("/profile", async (req, res) => {
    try {
        const userId = req.user?.userID || req.userID;
        const user = await UserModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                userName: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
});


// **************LOGOUT*****************
UserRouter.get("/logout", (req, res) => {
    const token = req.headers.authorization
    const blacklist = JSON.parse(fs.readFileSync("./blacklisted.json", { encoding: "utf-8" }));
    blacklist.push(token);
    fs.writeFileSync(". /blacklist.json", JSON.stringify(blacklist));
    res.send("you are logged out")
})
// ***********Appointments*************




module.exports = { UserRouter };







