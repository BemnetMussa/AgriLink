# 🔧 Fix: ERR_CONNECTION_REFUSED

## Problem
The frontend is trying to connect to `http://localhost:5000/api/v1/products` but getting `ERR_CONNECTION_REFUSED`.

## Root Cause
**The backend server is not running!**

## ✅ Solution

### Step 1: Start the Backend Server

Open a **new terminal** and run:

```powershell
cd server
npm run dev
```

**Wait for this message:**
```
🚀 AgriLink API server running on port 5000
Database connected successfully
```

### Step 2: Verify Backend is Running

Test the health endpoint:
- Open browser: http://localhost:5000/api/v1/health
- Or use PowerShell:
  ```powershell
  Invoke-WebRequest -Uri "http://localhost:5000/api/v1/health"
  ```

You should see:
```json
{
  "success": true,
  "message": "AgriLink API is running",
  "timestamp": "...",
  "version": "v1"
}
```

### Step 3: Keep Both Servers Running

You need **TWO terminals**:

**Terminal 1 (Backend):**
```powershell
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd client
npm run dev
```

## ✅ CORS Fixed

I've already fixed the CORS configuration:
- ✅ Allows all origins in development
- ✅ Supports credentials
- ✅ Handles preflight requests

## 🔍 Troubleshooting

### Backend won't start?

1. **Check PostgreSQL is running:**
   ```powershell
   Get-Service -Name postgresql*
   ```

2. **Check database connection:**
   - Verify `.env` has correct `DATABASE_URL`
   - Test: `npm run prisma:studio` (should open Prisma Studio)

3. **Check Prisma Client:**
   ```powershell
   cd server
   npm run prisma:generate
   ```

### Still getting connection refused?

1. **Check if port 5000 is in use:**
   ```powershell
   netstat -ano | findstr :5000
   ```

2. **Try a different port:**
   - Edit `server/.env`: Change `PORT=5000` to `PORT=5001`
   - Update `client/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1`

## 📋 Quick Checklist

- [ ] PostgreSQL is running
- [ ] Backend server is running (Terminal 1)
- [ ] Frontend server is running (Terminal 2)
- [ ] Health endpoint works: http://localhost:5000/api/v1/health
- [ ] No CORS errors in browser console

---

**The main issue is the backend server not running. Start it first!** 🚀
