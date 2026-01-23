# 🚀 How to Start Both Frontend and Backend

## Quick Start Guide

You need **TWO terminal windows** - one for the backend and one for the frontend.

### Terminal 1: Backend Server

```powershell
cd server
npm run dev
```

**Wait for this message:**
```
🚀 AgriLink API server running on port 5000
```

### Terminal 2: Frontend (if not already running)

```powershell
cd client
npm run dev
```

**You should see:**
```
✓ Ready in XXXXms
- Local: http://localhost:3001
```

## Verify Everything is Working

1. **Backend Health Check**: Open http://localhost:5000/api/v1/health
   - Should show: `{"success":true,"message":"AgriLink API is running"}`

2. **Frontend**: Open http://localhost:3001
   - Should load the homepage

3. **Server Status Indicator**: Look at bottom-right corner
   - 🟢 Green = Server is online
   - 🔴 Red = Server is offline

## Common Issues

### "Failed to fetch" Error
- **Cause**: Backend server is not running
- **Fix**: Start the backend server in Terminal 1 (see above)

### Port 5000 Already in Use
- **Fix**: Change `PORT=5001` in `server/.env`
- Update `NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1` in `client/.env.local`

### Database Connection Error
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `server/.env`

## Once Both Are Running

✅ No more "Failed to fetch" errors
✅ All API calls work
✅ Orders page loads correctly
✅ All features work as expected
