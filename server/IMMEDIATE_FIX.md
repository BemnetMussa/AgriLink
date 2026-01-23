# 🚨 Immediate Fix for Database Error

## Current Error
```
Can't reach database server at `localhost:5432`
```

## ⚡ Quickest Solution: Use SQLite (2 minutes)

If you want to test the backend **right now** without setting up PostgreSQL:

### Step 1: Switch to SQLite
```powershell
cd server
.\switch-to-sqlite.ps1
```

### Step 2: Generate and Migrate
```bash
npm run prisma:generate
npm run prisma:migrate
```

### Step 3: Start Server
```bash
npm run dev
```

**Done!** The server should now start. ✅

---

## 🗄️ Proper Solution: Setup PostgreSQL (10 minutes)

If you want to use PostgreSQL (recommended for production):

### Step 1: Install PostgreSQL
1. Download: https://www.postgresql.org/download/windows/
2. Install with default settings
3. **Remember the password** you set for `postgres` user

### Step 2: Start PostgreSQL Service
```powershell
# Check if installed
Get-Service -Name postgresql*

# Start the service (replace version number)
Start-Service postgresql-x64-16
```

Or use Services app:
- Press `Win + R` → type `services.msc`
- Find "postgresql" → Right-click → Start

### Step 3: Create Database
```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql, run:
CREATE DATABASE agrilink;
\q
```

### Step 4: Update .env
Edit `.env` file and change:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/agrilink?schema=public"
```
Replace `YOUR_PASSWORD` with your PostgreSQL password.

### Step 5: Run Migrations
```bash
npm run prisma:migrate
```

### Step 6: Start Server
```bash
npm run dev
```

---

## 🔄 Switch Back to PostgreSQL Later

If you used SQLite and want to switch back:

1. Restore schema: `Copy-Item prisma\schema.prisma.backup prisma\schema.prisma`
2. Update .env with PostgreSQL DATABASE_URL
3. Run: `npm run prisma:generate`
4. Run: `npm run prisma:migrate`

---

## ✅ Recommended Approach

1. **For quick testing**: Use SQLite (Solution 1)
2. **For proper development**: Setup PostgreSQL (Solution 2)

Both will work! Choose based on your needs.
