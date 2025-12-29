const mongoose = require('mongoose');
require('dotenv').config();

// Import User Model
const { UserModel } = require('../Model/UserModel');

// MongoDB Connection
const mongoURL = process.env.mongoURL || 'mongodb://localhost:27017/styler';

async function updateUserToAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURL);
        console.log('✅ Connected to MongoDB');

        // Get email from command line argument
        const userEmail = process.argv[2];
        
        if (!userEmail) {
            console.log('❌ Please provide an email address');
            console.log('Usage: node updateUserToAdmin.js <email>');
            console.log('Example: node updateUserToAdmin.js developerankit2127@gmail.com');
            process.exit(1);
        }

        // Find user by email
        const user = await UserModel.findOne({ email: userEmail });
        
        if (!user) {
            console.log('❌ User not found with email:', userEmail);
            console.log('\n📋 Available users:');
            const allUsers = await UserModel.find({}, 'email name role');
            allUsers.forEach(u => {
                console.log(`  - ${u.email} (${u.name}) - Role: ${u.role || 'user'}`);
            });
            process.exit(1);
        }

        console.log('\n👤 User found:');
        console.log('Name:', user.name);
        console.log('Email:', user.email);
        console.log('Current Role:', user.role || 'user');

        // Update role to admin
        user.role = 'admin';
        await user.save();

        console.log('\n✅ User updated successfully!');
        console.log('New Role:', user.role);
        console.log('\n🎉 User can now access admin panel!');

        // Disconnect
        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the script
updateUserToAdmin();
