const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import User Model
const { UserModel } = require('../Model/UserModel');

// MongoDB Connection
const mongoURL = process.env.mongoURL || 'mongodb://localhost:27017/styler';

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURL);
        console.log('✅ Connected to MongoDB');

        // Admin credentials
        const adminEmail = 'admin@styler.com';
        const adminPassword = 'admin123'; // Change this!
        const adminName = 'Admin User';

        // Check if admin already exists
        const existingAdmin = await UserModel.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            
            // Update role to admin if it's not
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✅ Updated user role to admin');
            }
        } else {
            // Hash password
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            // Create admin user
            const adminUser = new UserModel({
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                phone: '1234567890'
            });

            await adminUser.save();
            console.log('✅ Admin user created successfully!');
            console.log('\n📧 Admin Credentials:');
            console.log('Email:', adminEmail);
            console.log('Password:', adminPassword);
            console.log('\n⚠️  IMPORTANT: Change the password after first login!');
        }

        // Disconnect
        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the script
createAdminUser();
