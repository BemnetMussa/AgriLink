# 🚀 How to Start the Backend Server

## The "Failed to fetch" Error

**Important**: The console error "Failed to fetch" appears because the backend server is not running. This is **normal browser behavior** - browsers always log network errors to the console. We cannot suppress it, but we handle it gracefully.

## Quick Start

### Step 1: Open a Terminal
Open PowerShell, Command Prompt, or your terminal.

### Step 2: Navigate to Server Folder
```bash
cd server
```

### Step 3: Install Dependencies (if not done)
```bash
npm install
```

### Step 4: Generate Prisma Client (if not done)
```bash
npm run prisma:generate
```

### Step 5: Start the Server
```bash
npm run dev
```

### Step 6: Wait for Success Message
You should see:
```
🚀 AgriLink API server running on port 5000
```

## Verify Server is Running

1. **Check the terminal** - You should see the success message above
2. **Open browser**: http://localhost:5000/api/v1/health
3. **You should see**: `{"success":true,"message":"AgriLink API is running",...}`

## Visual Indicator

The frontend now shows a **Server Status** indicator in the bottom-right corner:
- 🟢 **Green** = Server is online
- 🔴 **Red** = Server is offline (with instructions)

## Troubleshooting

### Port 5000 Already in Use?
1. Find what's using port 5000: `netstat -ano | findstr :5000`
2. Kill the process or change PORT in `server/.env` to `5001`
3. Update `NEXT_PUBLIC_API_URL` in `client/.env.local` to match

### Database Connection Error?
1. Make sure PostgreSQL is running
2. Check `DATABASE_URL` in `server/.env`
3. Verify database exists: `psql -U postgres -d agrilink`

### Prisma Client Error?
```bash
cd server
npm run prisma:generate
```

## Once Server is Running

- ✅ The console error will stop appearing
- ✅ All API calls will work
- ✅ The Server Status indicator will show green
- ✅ You can use all features of the application

## Note About Console Errors

**The "Failed to fetch" error in the console is normal** when the server is not running. It's browser behavior that we cannot suppress. However:
- ✅ The error is caught and handled
- ✅ Users see friendly error messages in the UI
- ✅ The app doesn't crash
- ✅ Once the server starts, the error disappears
