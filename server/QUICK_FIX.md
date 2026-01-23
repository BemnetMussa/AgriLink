# Quick Fix: Database Connection Error

## The Problem
```
Can't reach database server at `localhost:5432`
```

This means PostgreSQL is not running or not configured correctly.

## Quick Solutions

### Solution 1: Setup PostgreSQL (5 minutes)

1. **Check if PostgreSQL is installed:**
   ```powershell
   Get-Service -Name postgresql*
   ```

2. **If not installed, download and install:**
   - https://www.postgresql.org/download/windows/
   - Use default settings
   - Remember the password you set for `postgres` user

3. **Start PostgreSQL service:**
   ```powershell
   # Find the service name
   Get-Service -Name postgresql*
   
   # Start it (replace with actual service name)
   Start-Service postgresql-x64-16
   ```

4. **Create the database:**
   ```powershell
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE agrilink;
   
   # Exit
   \q
   ```

5. **Update .env file:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/agrilink?schema=public"
   ```
   Replace `YOUR_PASSWORD` with the password you set during installation.

6. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

7. **Start server:**
   ```bash
   npm run dev
   ```

### Solution 2: Use SQLite for Quick Testing (2 minutes)

If you just want to test the backend without PostgreSQL:

1. **Update `prisma/schema.prisma`:**
   Change line 9-11 from:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   To:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. **Update .env:**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. **Regenerate and migrate:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

**Note:** SQLite is fine for development but PostgreSQL is recommended for production.

### Solution 3: Use Docker PostgreSQL (If you have Docker)

```bash
docker run --name agrilink-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=agrilink -p 5432:5432 -d postgres:16
```

Then update .env:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agrilink?schema=public"
```

## Which Solution to Choose?

- **Solution 1 (PostgreSQL)**: Best for production-like development
- **Solution 2 (SQLite)**: Fastest to get started, good for testing
- **Solution 3 (Docker)**: Good if you already use Docker

## After Database Setup

1. Run migrations: `npm run prisma:migrate`
2. (Optional) Seed data: `npm run prisma:seed`
3. Start server: `npm run dev`

The server should now start successfully! 🎉
