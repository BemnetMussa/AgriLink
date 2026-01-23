# 🚀 Quick Start Guide

## ⚠️ IMPORTANT: Both Servers Must Be Running!

The frontend needs the backend to be running to work properly.

## Step-by-Step Startup

### Terminal 1: Start Backend Server

```powershell
cd server
npm run dev
```

**Wait for this message:**
```
🚀 AgriLink API server running on port 5000
Database connected successfully
```

### Terminal 2: Start Frontend Server

```powershell
cd client
npm run dev
```

**Wait for this message:**
```
✓ Ready in XXXXms
- Local: http://localhost:3001
```

## ✅ Verify Everything Works

1. **Backend Health Check:**
   - Open: http://localhost:5000/api/v1/health
   - Should return JSON response

2. **Frontend:**
   - Open: http://localhost:3001
   - Should load without errors

## 🔧 CORS Fixed

I've updated the CORS configuration to:
- ✅ Allow all origins in development
- ✅ Support credentials
- ✅ Handle preflight OPTIONS requests

## 🐛 Troubleshooting

### Error: "ERR_CONNECTION_REFUSED"

**Backend is not running!**

1. Check if backend is running:
   - Look for "🚀 AgriLink API server running on port 5000"
   - If not, start it: `cd server && npm run dev`

2. Check PostgreSQL is running:
   ```powershell
   Get-Service -Name postgresql*
   ```

### Error: "CORS policy blocked"

This should be fixed. If you still see it:
1. Restart the backend server
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+F5)

## 📋 Checklist

- [ ] PostgreSQL is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 3001)
- [ ] Database is seeded (optional: `npm run prisma:seed` in server folder)

## 🎯 Next Steps

Once both servers are running:
1. Visit http://localhost:3001
2. Try logging in with:
   - Phone: `911111111`, Password: `admin123`
   - Phone: `922222222`, Password: `farmer123`
   - Phone: `933333333`, Password: `buyer123`

---

**Remember**: Always start the backend first, then the frontend!
