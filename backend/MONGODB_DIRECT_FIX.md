# 🔧 MongoDB Direct Fix

If the Node scripts don't work, you can update the user directly in MongoDB:

## Option 1: MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to: `mongodb+srv://ankit:ankit@ankit.dvau3gg.mongodb.net/styler-prod`
3. Navigate to: `styler-prod` database → `users` collection
4. Find your user: `{ email: "developerankit2127@gmail.com" }`
5. Click Edit
6. Change `role` field to: `"admin"`
7. Click Update
8. Done!

---

## Option 2: MongoDB Shell

```bash
mongosh "mongodb+srv://ankit:ankit@ankit.dvau3gg.mongodb.net/styler-prod"
```

Then run:
```javascript
db.users.updateOne(
  { email: "developerankit2127@gmail.com" },
  { $set: { role: "admin" } }
)
```

Should see:
```
{ acknowledged: true, modifiedCount: 1 }
```

---

## Option 3: Check Current User

To see your current user data:
```javascript
db.users.findOne({ email: "developerankit2127@gmail.com" })
```

Should return something like:
```javascript
{
  _id: ObjectId("..."),
  name: "Ankit Singh",
  email: "developerankit2127@gmail.com",
  password: "$2b$...",  // hashed
  role: "admin",  // ← This should be "admin"
  phone: "..."
}
```

---

## Verify the Fix

After updating:

1. **Clear browser localStorage:**
   ```javascript
   // In browser console (F12)
   localStorage.clear();
   ```

2. **Login again:** http://localhost:5173/admin/login

3. **Should work!** ✅

---

## Database Schema

Your user document structure:
```javascript
{
  name: String,       // "Ankit Singh"
  email: String,      // "developerankit2127@gmail.com"
  password: String,   // Hashed password
  phone: String,      // "1234567890"
  role: String        // Must be "admin" for admin access
}
```

---

## Common Issues

### Issue: Can't connect to MongoDB
**Solution:** Check internet connection and MongoDB credentials

### Issue: User not found
**Solution:** The user might be in a different database/collection
```javascript
// List all databases
show dbs

// Switch to styler-prod
use styler-prod

// List all collections
show collections

// Find all users
db.users.find()
```

### Issue: Modified but still unauthorized
**Solution:** 
1. Clear browser cache
2. Clear localStorage
3. Restart backend server
4. Login again

---

## Alternative: Create Admin User via MongoDB Shell

```javascript
use styler-prod

db.users.insertOne({
  name: "Admin User",
  email: "admin@styler.com",
  password: "$2b$10$YourHashedPasswordHere",
  phone: "1234567890",
  role: "admin"
})
```

⚠️ Note: Password needs to be hashed with bcrypt. Better to use the Node script!
