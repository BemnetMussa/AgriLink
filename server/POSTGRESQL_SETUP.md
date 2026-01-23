# ✅ Switched Back to PostgreSQL!

I've successfully converted your backend from MongoDB back to PostgreSQL.

## 🔄 What Changed

1. ✅ **Datasource**: Changed from `mongodb` to `postgresql`
2. ✅ **ID Fields**: Changed from MongoDB ObjectId to PostgreSQL UUID (`@default(uuid())`)
3. ✅ **Foreign Keys**: Removed `@db.ObjectId` annotations
4. ✅ **Indexes**: Restored all PostgreSQL indexes
5. ✅ **Prisma Client**: Regenerated for PostgreSQL
6. ✅ **Scripts**: Updated to use `prisma migrate` instead of `db push`

## 🚀 Next Steps

### Step 1: Install PostgreSQL (if not already installed)

**Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. **Remember the password** you set for the `postgres` user
4. Default port is `5432`

### Step 2: Create Database

**Option A: Using psql (Command Line)**
```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql, run:
CREATE DATABASE agrilink;
\q
```

**Option B: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `agrilink`
4. Click "Save"

### Step 3: Update .env File

Edit `server/.env` and update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/agrilink?schema=public"
```

Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

### Step 4: Run Migrations

```bash
npm run prisma:migrate
```

This will:
- Create all tables in PostgreSQL
- Set up relationships
- Create indexes

### Step 5: (Optional) Seed Database

```bash
npm run prisma:seed
```

This creates:
- Admin user (phone: `911111111`, password: `admin123`)
- Farmer user (phone: `922222222`, password: `farmer123`)
- Buyer user (phone: `933333333`, password: `buyer123`)
- Sample products

### Step 6: Start Server

```bash
npm run dev
```

## ✅ Success Indicators

When everything works, you'll see:

```
🚀 AgriLink API server running on port 5000
Database connected successfully
```

## 🐛 Troubleshooting

### Error: "Can't reach database server at localhost:5432"

**PostgreSQL is not running:**
1. Check if PostgreSQL service is running:
   ```powershell
   Get-Service -Name postgresql*
   ```
2. Start PostgreSQL service:
   ```powershell
   Start-Service postgresql-x64-16  # Adjust version number
   ```
3. Or use Services app:
   - Press `Win + R` → type `services.msc`
   - Find "postgresql" → Right-click → Start

### Error: "password authentication failed"

- Check your password in `DATABASE_URL`
- Make sure you're using the correct username (usually `postgres`)

### Error: "database 'agrilink' does not exist"

- Create the database (see Step 2 above)

## 📋 Quick Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Seed database
npm run prisma:seed

# Start server
npm run dev
```

## 🎯 All Set!

Your backend is now configured for PostgreSQL. Just:
1. Install PostgreSQL (if needed)
2. Create database `agrilink`
3. Update `.env` with your PostgreSQL connection string
4. Run `npm run prisma:migrate`
5. Run `npm run dev`

The server should start successfully! 🚀
