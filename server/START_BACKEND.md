# 🚀 Start Backend Server

## Quick Start

The backend server must be running for the frontend to work!

### Step 1: Start Backend Server

```powershell
cd server
npm run dev
```

You should see:
```
🚀 AgriLink API server running on port 5000
Database connected successfully
```

### Step 2: Verify Backend is Running

Open in browser: http://localhost:5000/api/v1/health

Or test with curl:
```powershell
curl http://localhost:5000/api/v1/health
```

### Step 3: Start Frontend (in a new terminal)

```powershell
cd client
npm run dev
```

## ✅ CORS Fixed

I've updated the CORS configuration to:
- ✅ Allow all origins in development mode
- ✅ Support credentials
- ✅ Handle preflight OPTIONS requests
- ✅ Allow necessary headers

## 🔍 Troubleshooting

### Error: "ERR_CONNECTION_REFUSED"

**Backend is not running!**

1. Make sure PostgreSQL is running
2. Start the backend server:
   ```powershell
   cd server
   npm run dev
   ```

### Error: "CORS policy blocked"

This should be fixed now. If you still see it:
1. Restart the backend server
2. Clear browser cache
3. Check that backend is on port 5000 and frontend on port 3001

## 📋 Both Servers Should Run

- **Backend**: `http://localhost:5000` (server folder)
- **Frontend**: `http://localhost:3001` (client folder)

Run them in separate terminals!
