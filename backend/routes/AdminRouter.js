const express = require("express");
require("dotenv").config();
const { UserModel } = require("../models/UserModel");
const { StylerModel } = require("../models/StylerModel");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { AppointmentModel } = require("../models/AppointmentModel");
const { BlockUserModel } = require("../models/BlockUserModel");
const { StylesModel } = require("../models/Styles")
const statusemail = require("../config/statusemail");
const { authorization } = require("../middleware/Authorization");
const { authenticate } = require("../middleware/Authentication");
const { generateTokenPair, verifyRefreshToken } = require("../utils/jwtHelper");
const AdminRouter = express.Router();

// ************REGISTER ADMIN***************

AdminRouter.post("/register", async (req, res) => {
    let payload = req.body;
    let check = await UserModel.find({ email: payload.email });
    if (check.length !== 0) {
        res.send({ "msg": "Email already registered" })
    } else {
        try {
            bcrypt.hash(payload.password, +2, async (err, hash) => {
                if (err) {
                    res.send({ message: err.message });
                } else {
                    payload.password = hash;
                    payload.role = `admin`
                    const User = new UserModel(payload);
                    await User.save();
                    res.send({ "message": `Admin Register Sucessfull` });
                }
            });
        } catch (error) {
            // console.log({ message: error.message });
            res.send({ message: error.message });
        }
    }

});

// ************LOGIN***************

AdminRouter.post("/login", async (req, res) => {
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
                message: "User not found. Please register first."
            });
        }

        // Verify admin role
        if (User.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized. Admin access only."
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
            role: User.role,
            email: User.email
        };

        const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

        console.log("Admin login successful for:", email);

        // Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token: accessToken,
            refreshToken: refreshToken,
            username: User.name,
            email: User.email,
            userType: User.role
        });

    } catch (error) {
        console.error("Admin login error:", error.message);
        res.status(500).json({
            success: false,
            message: "Login failed. Please try again.",
            error: error.message
        });
    }
});

// ************PUBLIC ENDPOINTS (No Auth Required)************

// Get all stylers - Public endpoint for booking page
AdminRouter.get("/stylers", async (req, res) => {
    try {
        const stylers = await StylerModel.find();

        // Transform data to match frontend expectations
        const transformedStylers = stylers.map(styler => ({
            _id: styler._id,
            name: styler.Styler_name || styler.name,
            specialization: styler.specialization || 'Expert Styler',
            city: styler.city,
            email: styler.email,
            mob_no: styler.mob_no
        }));

        res.status(200).json({
            success: true,
            data: transformedStylers
        });
    } catch (error) {
        console.error("Error fetching stylers:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stylers",
            error: error.message
        });
    }
});

// Get all services - Public endpoint for booking page
AdminRouter.get("/services", async (req, res) => {
    try {
        const services = await StylesModel.find();

        // Transform data to match frontend expectations
        const transformedServices = services.map(service => ({
            _id: service._id,
            name: service.name,
            serviceName: service.name, // Alias for compatibility
            price: service.price,
            amount: service.price, // Alias for compatibility
            description: service.category || 'Premium grooming service',
            category: service.category,
            image: service.image,
            forGender: service.ForGender
        }));

        res.status(200).json({
            success: true,
            data: transformedServices
        });
    } catch (error) {
        console.error("Error fetching services:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch services",
            error: error.message
        });
    }
});

// ************PROTECTED ENDPOINTS (Auth Required)************
AdminRouter.use(authenticate);
AdminRouter.use(authorization("admin"))

// ************ALL REGISTER USER***************

AdminRouter.get("/allusers", async (req, res) => {
    let search = req.query
    let data = await UserModel.find(search)
    res.send(data);
});
//******Block user*********/
AdminRouter.post("/Block/", async (req, res) => {
    let data = req.body;
    let Blockuser = await new BlockUserModel(data);
    await Blockuser.save();
    res.status(200).send({ msg: "user has been blocked" });
})
// ****************ALL STYLER ******************


AdminRouter.get("/All_Stylers", async (req, res) => {
    let search = req.query
    let data = await StylerModel.find(search);
    res.send(data);
});

// ****************ADD STYLER ******************


AdminRouter.post("/create/styler", async (req, res) => {
    let payload = req.body;
    let data = await new StylerModel(payload);
    data.save();
    res.send({ "msg": "Style Added" });
});


// ***********UPDATE SYLER************
AdminRouter.patch("/update/styler/:id", async (req, res) => {
    let ID = req.params.id;
    let payload = req.body
    let data = StylerModel.findOne({ "_id": ID })
    await StylerModel.updateOne({ "_id": ID }, payload)
    statusemail(data.UserEmail, payload.status);
    res.send({ "msg": "Style Updated" });
});

// ***********DELETE SYLER************

AdminRouter.delete("/delete/styler/:id", async (req, res) => {
    let ID = req.params.id;
    let payload = req.body
    await StylerModel.deleteOne({ "_id": ID })
    res.send({ "msg": "Style Deleted" });
});



//**************All Appointments*************/
AdminRouter.get("/All_appoints", async (req, res) => {
    let search = req.query
    let data = await AppointmentModel.find(search);
    res.send(data);
})

//*************Update Appointmentr **********/
AdminRouter.patch("/update/appointment/:id", async (req, res) => {
    let status = req.body;
    let id = req.params.id;
    await AppointmentModel.updateOne({ "_id": id }, status);
    res.send({ msg: "done" });
})

//*******Styles All OPERATIONS **********/


// ************ALL STYLES*****************

AdminRouter.get("/styles", async (req, res) => {
    let allstyles = await StylesModel.find();
    res.status(200).send(allstyles)
})

// ************ADD STYLES*****************

AdminRouter.post("/styles/add", async (req, res) => {
    let payload = req.body;
    let style = await new StylesModel(payload);
    style.save()
    res.status(200).send({ "msg": "New Style added" })
})

// ************UPDATE STYLES*****************

AdminRouter.patch("/styles/update/:id", async (req, res) => {
    let id = req.params.id;
    let payload = req.body;
    await StylesModel.updateOne({ "_id": id }, payload)
    res.status(200).send({ "msg": "New Style Updated" })
})
AdminRouter.delete("/styles/delete/:id", async (req, res) => {
    let id = req.params.id;
    await StylesModel.deleteOne({ "_id": id })
    res.status(200).send({ "msg": "New Style Delete" })
})

/*******Logout *******/
AdminRouter.get("/logout", (req, res) => {
    const token = req.headers.authorization
    const blacklist = JSON.parse(fs.readFileSync("./blacklisted.json", { encoding: "utf-8" }));
    blacklist.push(token);
    fs.writeFileSync("./blacklist.json", JSON.stringify(blacklist));
    res.send("you are logged out")
})



module.exports = { AdminRouter };

