# Backend Issues - Fix Guide

## Common Issues and Solutions

### Issue 1: "Cannot find module" or Missing Dependencies

**Solution:**
```bash
cd server
npm install
```

If that doesn't work, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Prisma Client Not Generated

**Solution:**
```bash
npm run prisma:generate
```

### Issue 3: Database Connection Error

**Solution:**
1. Make sure PostgreSQL is installed and running
2. Update `.env` file with correct DATABASE_URL:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/agrilink?schema=public"
   ```
3. Create the database:
   ```sql
   CREATE DATABASE agrilink;
   ```
4. Run migrations:
   ```bash
   npm run prisma:migrate
   ```

### Issue 4: TypeScript Compilation Errors

**Solution:**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# If there are errors, they will be shown
```

### Issue 5: Port Already in Use

**Solution:**
Change PORT in `.env` file:
```env
PORT=5001
```

### Issue 6: Missing .env File

**Solution:**
```bash
cp .env.example .env
# Then edit .env with your settings
```

### Issue 7: Winston Logger Fails (logs directory)

**Solution:**
The logs directory should be created automatically, but if it fails:
```bash
mkdir logs
```

## Complete Setup Steps (Fresh Install)

```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies
npm install

# 3. Create .env file (if not exists)
if not exist .env copy .env.example .env

# 4. Edit .env and set DATABASE_URL

# 5. Generate Prisma Client
npm run prisma:generate

# 6. Run database migrations
npm run prisma:migrate

# 7. (Optional) Seed database
npm run prisma:seed

# 8. Start server
npm run dev
```

## Quick Test

After setup, test the server:
```bash
# In another terminal
curl http://localhost:5000/health
```

Should return:
```json
{
  "success": true,
  "message": "AgriLink API is running",
  "timestamp": "..."
}
```

## Still Having Issues?

1. Check Node.js version: `node --version` (should be 18+)
2. Check npm version: `npm --version`
3. Check if PostgreSQL is running
4. Check `.env` file exists and has DATABASE_URL
5. Check console for specific error messages
