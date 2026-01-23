# 🔧 COMPLETE FIX GUIDE - MongoDB Connection Issue

## ❌ Current Error
```
Error: An error occurred during DNS resolution: A socket operation was attempted to an unreachable network.
```

## ✅ THE FIX (2 Minutes)

**This is a MongoDB Atlas security feature. Your IP address must be whitelisted.**

### Step-by-Step Fix:

1. **Open MongoDB Atlas Dashboard**
   - Go to: https://cloud.mongodb.com/
   - Log in with your MongoDB account

2. **Navigate to Network Access**
   - Click **"Network Access"** in the left sidebar
   - (It might be called "IP Access List" in some versions)

3. **Add Your IP Address**
   - Click the **"Add IP Address"** button (green button, top right)
   - You'll see two options:
     - **"Add Current IP Address"** ← Click this (easiest!)
     - **"Add IP Address"** (manual entry)
   - Click **"Confirm"**

4. **OR Allow All IPs (Quick Test)**
   - Click **"Add IP Address"**
   - Enter: `0.0.0.0/0`
   - Comment: "Development - allow all"
   - Click **"Confirm"**
   - ⚠️ **Warning**: This allows all IPs. Only use for development!

5. **Wait 1-2 Minutes**
   - MongoDB Atlas needs time to apply the changes
   - You'll see the IP address appear in the list

6. **Test Connection**
   ```bash
   node test-mongodb-connection.js
   ```
   You should see: `✅ Successfully connected to MongoDB!`

7. **Push Schema**
   ```bash
   npx prisma db push
   ```

8. **Start Server**
   ```bash
   npm run dev
   ```

## 🚀 Quick Start Script

I've created a startup script that checks everything:

```powershell
.\start-with-check.ps1
```

This script will:
- ✅ Check Prisma Client
- ✅ Test MongoDB connection
- ✅ Push schema if needed
- ✅ Start the server

## 📋 Alternative: Manual Steps

If you prefer to do it manually:

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. Test connection
node test-mongodb-connection.js

# 3. Push schema
npx prisma db push

# 4. (Optional) Seed database
npm run prisma:seed

# 5. Start server
npm run dev
```

## 🔍 Troubleshooting

### Still Getting Connection Error?

1. **Double-check IP whitelist**
   - Go back to MongoDB Atlas → Network Access
   - Make sure your IP (or 0.0.0.0/0) is in the list
   - Status should be "Active"

2. **Wait longer**
   - Sometimes it takes 2-3 minutes for changes to propagate
   - Try again after waiting

3. **Check your internet**
   - Make sure you have an active internet connection
   - Try accessing other websites

4. **Firewall/Antivirus**
   - Temporarily disable to test
   - Or add MongoDB to allowed applications

5. **VPN/Corporate Network**
   - If on VPN, disconnect and try
   - Corporate networks might block MongoDB

### Connection Works But Server Fails?

1. **Check Prisma Client**
   ```bash
   npm run prisma:generate
   ```

2. **Check .env file**
   - Make sure `DATABASE_URL` is correct
   - No extra quotes or spaces

3. **Check MongoDB cluster status**
   - In MongoDB Atlas, verify cluster is "Running" (green)

## ✅ Success Indicators

When everything works, you'll see:

```
✅ Prisma Client ready
✅ MongoDB connection successful!
✅ Database schema is up to date
🚀 AgriLink API server running on port 5000
Database connected successfully
```

## 🎯 Next Steps After Fix

Once the server starts:

1. **Test API endpoints**
   - Health check: `http://localhost:5000/api/v1/health`
   - API docs: Check your routes

2. **Seed database (optional)**
   ```bash
   npm run prisma:seed
   ```
   This creates:
   - Admin user (phone: 911111111, password: admin123)
   - Farmer user (phone: 922222222, password: farmer123)
   - Buyer user (phone: 933333333, password: buyer123)
   - Sample products

3. **Start frontend**
   ```bash
   cd ../client
   npm run dev
   ```

## 📞 Still Having Issues?

If you've tried everything and it's still not working:

1. Verify MongoDB Atlas cluster is running
2. Check connection string in `.env`
3. Try allowing all IPs (0.0.0.0/0) temporarily
4. Check MongoDB Atlas logs for any errors

---

**Remember**: The IP whitelist is a security feature. Once you add your IP, the connection should work immediately (after 1-2 minute wait).
