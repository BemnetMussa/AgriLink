# 🚀 How to Start the Backend Server

## Quick Start

1. **Open a terminal/command prompt**

2. **Navigate to the server folder:**
   ```bash
   cd server
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

4. **Wait for this message:**
   ```
   🚀 AgriLink API server running on port 5000
   ```

5. **Verify it's running:**
   - Open browser: http://localhost:5000/api/v1/health
   - You should see: `{"success":true,"message":"AgriLink API is running",...}`

## Troubleshooting

### Port 5000 already in use?
- Change `PORT` in `server/.env` file to another port (e.g., `5001`)
- Update `NEXT_PUBLIC_API_URL` in `client/.env.local` to match

### Database connection error?
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `server/.env`
- Run: `npx prisma migrate dev` to set up database

### Still having issues?
- Check the terminal output for specific error messages
- Make sure all dependencies are installed: `npm install`
- Verify Node.js version: `node --version` (should be 18+)
