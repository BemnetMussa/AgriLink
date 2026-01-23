# 🚀 START HERE - Backend Setup (PostgreSQL)

## ✅ Backend is Configured for PostgreSQL

Your backend has been converted to use PostgreSQL instead of MongoDB.

## 🚀 Quick Setup

### Step 1: Install PostgreSQL (if not installed)

**Windows:**
1. Download: https://www.postgresql.org/download/windows/
2. Install with default settings
3. **Remember the password** for `postgres` user

### Step 2: Start PostgreSQL Service

```powershell
# Check if running
Get-Service -Name postgresql*

# Start if not running
Start-Service postgresql-x64-16  # Adjust version number
```

Or use Services app: `Win + R` → `services.msc` → Find "postgresql" → Start

### Step 3: Create Database

```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql, run:
CREATE DATABASE agrilink;
\q
```

### Step 4: Update .env

Edit `server/.env` and set your PostgreSQL connection:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/agrilink?schema=public"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### Step 5: Run Migrations

```bash
npm run prisma:migrate
```

### Step 6: (Optional) Seed Database

```bash
npm run prisma:seed
```

### Step 7: Start Server

```bash
npm run dev
```

## ✅ Success Indicators

When everything works:

```
🚀 AgriLink API server running on port 5000
Database connected successfully
```

## 🐛 Troubleshooting

### "Can't reach database server"
→ PostgreSQL service is not running (see Step 2)

### "password authentication failed"
→ Check password in `.env` file

### "database does not exist"
→ Create database (see Step 3)

## 📚 More Help

See `POSTGRESQL_SETUP.md` for detailed instructions.

---

**Remember**: PostgreSQL must be installed and running before starting the server!
