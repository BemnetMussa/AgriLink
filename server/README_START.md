# How to Start the Backend Server

## Quick Start (Recommended)

### Option 1: Using PowerShell Script (Windows)
```powershell
cd server
.\start.ps1
```

### Option 2: Manual Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   # Copy .env.example to .env (if not exists)
   copy .env.example .env
   
   # Edit .env and set your DATABASE_URL
   # Example: DATABASE_URL="postgresql://postgres:password@localhost:5432/agrilink?schema=public"
   ```

3. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

4. **Run Database Migrations** (First time only)
   ```bash
   npm run prisma:migrate
   ```

5. **Start Server**
   ```bash
   npm run dev
   ```

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL** - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## Database Setup

### 1. Install PostgreSQL
Download and install PostgreSQL from https://www.postgresql.org/download/

### 2. Create Database
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE agrilink;

-- Exit
\q
```

### 3. Update .env
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/agrilink?schema=public"
```

Replace `yourpassword` with your PostgreSQL password.

## Common Errors

### Error: "Cannot find module '@prisma/client'"
**Fix:**
```bash
npm install
npm run prisma:generate
```

### Error: "Database connection failed"
**Fix:**
1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env is correct
3. Test connection: `psql -U postgres -d agrilink`

### Error: "Port 5000 already in use"
**Fix:**
Change PORT in .env file to another port (e.g., 5001)

### Error: "Prisma schema not found"
**Fix:**
Make sure `prisma/schema.prisma` exists

## Testing the Server

Once started, test with:
```bash
curl http://localhost:5000/health
```

Or open in browser: http://localhost:5000/health

Should return:
```json
{
  "success": true,
  "message": "AgriLink API is running",
  "timestamp": "..."
}
```

## Next Steps

After server starts successfully:
1. Frontend should connect to `http://localhost:5000/api/v1`
2. Test API endpoints using Postman or curl
3. Check logs in `logs/` directory

## Need Help?

See `FIX_ISSUES.md` for detailed troubleshooting guide.
