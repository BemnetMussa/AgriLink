# Quick Start Guide - Backend Setup

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or remote)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and set your DATABASE_URL
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/agrilink?schema=public"
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Run Database Migrations
```bash
npm run prisma:migrate
```

### 5. (Optional) Seed Database
```bash
npm run prisma:seed
```

### 6. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Troubleshooting

### Issue: "Cannot find module"
**Solution**: Run `npm install` again

### Issue: "Prisma Client not generated"
**Solution**: Run `npm run prisma:generate`

### Issue: "Database connection failed"
**Solution**: 
1. Check your DATABASE_URL in .env
2. Ensure PostgreSQL is running
3. Verify database credentials

### Issue: "Port 5000 already in use"
**Solution**: Change PORT in .env file

### Issue: "JWT_SECRET not set"
**Solution**: Add JWT_SECRET to .env file (any random string)

## Minimum .env Configuration

For quick testing, you only need:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/agrilink?schema=public"
JWT_SECRET="your-secret-key-here"
PORT=5000
```

## Windows PowerShell Setup

If you're on Windows, you can use the setup script:
```powershell
cd server
.\setup.ps1
```
