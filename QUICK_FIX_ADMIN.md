# 🚀 QUICK FIX: Make Your Account Admin

## Run this command NOW:

```bash
cd /Users/ankit/Desktop/Styler/backend
node scripts/updateUserToAdmin.js developerankit2127@gmail.com
```

This will:
1. ✅ Find your user account
2. ✅ Update role to 'admin'
3. ✅ Allow admin access

---

## After running the command:

1. **Clear browser storage:**
   - Press F12
   - Application → Storage
   - Click "Clear site data"

2. **Login again at:** http://localhost:5173/admin/login
   - Email: developerankit2127@gmail.com
   - Password: (your password)

3. **You should see:**
   - ✅ "Admin login successful!" message
   - ✅ Redirect to /admin/dashboard
   - ✅ No more "Unauthorized" errors

---

## Alternative: Create Default Admin

If the above doesn't work, create a new admin:

```bash
cd /Users/ankit/Desktop/Styler/backend
node scripts/createAdmin.js
```

**Login with:**
- Email: admin@styler.com
- Password: admin123

---

## Still not working?

Check if backend is running:
```bash
cd /Users/ankit/Desktop/Styler/backend
npm start
```

Should see:
```
✅ Server running on port 9168
🎉 Connected to MongoDB
```
