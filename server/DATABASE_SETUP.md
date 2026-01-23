# Database Setup Guide

## Error: Can't reach database server at `localhost:5432`

This means PostgreSQL is either not installed, not running, or the connection string is incorrect.

## Solution Options

### Option 1: Install and Setup PostgreSQL (Recommended)

#### Step 1: Install PostgreSQL
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the `postgres` user
4. Default port is 5432

#### Step 2: Start PostgreSQL Service
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# If not running, start it
Start-Service postgresql-x64-16  # Adjust version number as needed
```

Or use Services app:
- Press `Win + R`, type `services.msc`
- Find "postgresql" service
- Right-click → Start

#### Step 3: Create Database
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE agrilink;

# Exit
\q
```

#### Step 4: Update .env
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/agrilink?schema=public"
```

Replace `YOUR_PASSWORD` with the password you set during installation.

### Option 2: Use SQLite for Development (Quick Start)

If you want to test without PostgreSQL, we can switch to SQLite temporarily.

#### Step 1: Update Prisma Schema
Change `datasource db` in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

#### Step 2: Update .env
```env
DATABASE_URL="file:./dev.db"
```

#### Step 3: Regenerate and Migrate
```bash
npm run prisma:generate
npm run prisma:migrate
```

### Option 3: Use Docker PostgreSQL (Alternative)

If you have Docker installed:

```bash
# Run PostgreSQL in Docker
docker run --name agrilink-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=agrilink -p 5432:5432 -d postgres:16

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agrilink?schema=public"
```

## Quick Test

After setting up PostgreSQL, test the connection:

```bash
# Test connection
psql -U postgres -d agrilink -c "SELECT 1;"
```

If this works, your database is ready!

## After Database Setup

1. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

2. **Seed database (optional):**
   ```bash
   npm run prisma:seed
   ```

3. **Start server:**
   ```bash
   npm run dev
   ```

## Troubleshooting

### "psql: command not found"
- Add PostgreSQL bin directory to PATH
- Usually: `C:\Program Files\PostgreSQL\16\bin`

### "Password authentication failed"
- Check your password in DATABASE_URL
- Try resetting PostgreSQL password

### "Database does not exist"
- Create it: `CREATE DATABASE agrilink;`

### "Connection refused"
- PostgreSQL service is not running
- Start the service (see Step 2 above)
