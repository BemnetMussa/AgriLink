# 🔧 MongoDB Atlas Connection Fix

## Current Error
```
A socket operation was attempted to an unreachable network. (os error 10051)
```

This is a **network connectivity issue** - Prisma cannot reach your MongoDB Atlas cluster.

## ✅ Most Common Fix: IP Whitelist

MongoDB Atlas blocks connections from IPs that aren't whitelisted. You need to add your IP address.

### Step 1: Get Your Current IP Address

**Option A: Using PowerShell**
```powershell
(Invoke-WebRequest -Uri "https://api.ipify.org").Content
```

**Option B: Using Browser**
Visit: https://www.whatismyip.com/

### Step 2: Add IP to MongoDB Atlas

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Click **"Network Access"** (or **"IP Access List"**) in the left sidebar
3. Click **"Add IP Address"** button
4. Choose one:
   - **For Development**: Click **"Add Current IP Address"** (recommended)
   - **Or manually**: Enter your IP address and click **"Confirm"**
   - **For Testing Only**: Add `0.0.0.0/0` to allow all IPs (⚠️ **NOT for production!**)

5. Wait 1-2 minutes for the change to take effect

### Step 3: Try Again

```bash
npx prisma db push
```

## 🔍 Other Possible Issues

### 1. Internet Connection
Make sure you have an active internet connection.

### 2. Firewall/Antivirus
Your firewall or antivirus might be blocking the connection. Try:
- Temporarily disable firewall/antivirus
- Or add MongoDB Atlas to allowed applications

### 3. Corporate Network/VPN
If you're on a corporate network or VPN:
- Try disconnecting VPN
- Or ask IT to whitelist MongoDB Atlas IPs

### 4. MongoDB Atlas Cluster Status
Check if your cluster is running:
1. Go to MongoDB Atlas Dashboard
2. Check if cluster status shows "Running" (green)

## 🧪 Test Connection

After whitelisting your IP, test the connection:

```bash
npx prisma db push
```

You should see:
```
✔ The database is now in sync with your Prisma schema.
```

## 📋 Quick Checklist

- [ ] Added current IP to MongoDB Atlas IP Access List
- [ ] Waited 1-2 minutes after adding IP
- [ ] Internet connection is active
- [ ] MongoDB Atlas cluster is running
- [ ] Firewall is not blocking connection

## 🚀 After Connection Works

Once `npx prisma db push` succeeds:

1. **Optional: Seed database**
   ```bash
   npm run prisma:seed
   ```

2. **Start server**
   ```bash
   npm run dev
   ```

## 💡 Pro Tip

For development, you can temporarily allow all IPs (`0.0.0.0/0`) but **remember to remove it** before going to production and add only specific IPs!
