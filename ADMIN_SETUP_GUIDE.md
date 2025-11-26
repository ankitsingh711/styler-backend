# Admin Access Setup Guide

## Problem: "Unauthorized. Admin access only" Error

You're getting this error because the user account doesn't have admin privileges in the database.

---

## 🔧 Solution: Grant Admin Access to Your Account

### **Method 1: Update Existing User to Admin (Recommended)**

Run this command to make your existing user an admin:

```bash
cd backend
node scripts/updateUserToAdmin.js developerankit2127@gmail.com
```

Replace `developerankit2127@gmail.com` with your email address.

**What this does:**
- Finds your user in the database
- Updates the `role` field to `'admin'`
- Allows you to access admin panel

---

### **Method 2: Create a New Admin User**

Run this command to create a default admin user:

```bash
cd backend
node scripts/createAdmin.js
```

**Default Admin Credentials:**
- **Email:** admin@styler.com
- **Password:** admin123

⚠️ **IMPORTANT:** Change the password after first login!

---

## 🔍 How to Verify

### 1. Check Backend Logs
When you try to log in, the backend will log:
```
Authorization check: {
  requiredRole: 'admin',
  userRole: 'user' or 'admin',
  userId: '...'
}
```

### 2. Check Database
Your user document should have:
```json
{
  "email": "your-email@example.com",
  "name": "Your Name",
  "role": "admin"  // ← This must be 'admin'
}
```

---

## 📝 Step-by-Step Instructions

### **Step 1: Make sure backend is running**
```bash
cd backend
npm start
```

### **Step 2: Update your user to admin**
Open a new terminal:
```bash
cd backend
node scripts/updateUserToAdmin.js YOUR_EMAIL_HERE
```

### **Step 3: Clear browser storage**
1. Open DevTools (F12)
2. Go to Application → Storage
3. Click "Clear site data"
4. Refresh the page

### **Step 4: Login again**
1. Go to `/admin/login`
2. Enter your email and password
3. You should now be able to access the admin dashboard

---

## 🐛 Troubleshooting

### Error: "User not found"
**Solution:** The email doesn't exist in the database. Create an account first:
1. Go to `/login`
2. Sign up with your email
3. Then run the update script

### Error: "Cannot find module"
**Solution:** Install dependencies:
```bash
cd backend
npm install
```

### Still getting "Unauthorized" error
**Check these:**

1. **Token is valid:**
   - Clear browser localStorage
   - Login again

2. **Role is set correctly:**
   ```bash
   # Check in MongoDB
   use styler-prod
   db.users.find({ email: "your-email@example.com" })
   ```

3. **Backend is using correct database:**
   - Check `.env` file
   - Verify `mongoURL` is correct

---

## 🔐 Security Notes

### Production Checklist:
- [ ] Change default admin password
- [ ] Use strong passwords
- [ ] Don't commit `.env` file
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting on login endpoints
- [ ] Add 2FA for admin accounts (future enhancement)

---

## 📊 Understanding User Roles

### User Types in the System:

1. **Regular User** (`role: 'user'`)
   - Can view services
   - Can book appointments
   - Can view their profile
   - Access: `/services`, `/profile`

2. **Admin** (`role: 'admin'`)
   - All regular user permissions
   - Can manage users
   - Can manage stylists
   - Can manage services
   - Can view all appointments
   - Access: `/admin/*`

---

## 🚀 Quick Fix Commands

### Update your email to admin:
```bash
cd backend && node scripts/updateUserToAdmin.js YOUR_EMAIL@example.com
```

### Create default admin:
```bash
cd backend && node scripts/createAdmin.js
```

### List all users:
```bash
cd backend
node -e "
const mongoose = require('mongoose');
const { UserModel } = require('./Model/UserModel');
require('dotenv').config();

mongoose.connect(process.env.mongoURL).then(async () => {
  const users = await UserModel.find({}, 'email name role');
  console.log('All users:');
  users.forEach(u => console.log(\`- \${u.email} (\${u.role || 'user'})\`));
  process.exit(0);
});
"
```

---

## 💡 How the System Works

### Login Flow:
```
1. User enters credentials
2. Backend validates email/password
3. Backend checks user.role in database
4. Backend generates JWT with role
5. Frontend stores token
6. Frontend sends token with requests
7. Backend verifies token and checks role
8. If role === 'admin' → Allow access
   If role !== 'admin' → Return 403 error
```

### Database Schema:
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  role: String  // 'user' or 'admin'
}
```

---

## ✅ Success Indicators

You know it's working when:
- ✅ Login redirects to `/admin/dashboard`
- ✅ You see "Admin login successful!" toast
- ✅ No "Unauthorized" error
- ✅ Admin navbar shows dashboard links
- ✅ You can access all admin pages

---

## 📞 Need Help?

If you're still having issues:

1. **Check backend logs** - Look for authorization errors
2. **Check network tab** - Look at the login response
3. **Check localStorage** - Verify token is stored
4. **Check database** - Confirm role is 'admin'

---

**Last Updated:** Nov 27, 2025
