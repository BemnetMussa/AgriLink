# Startup Script with Connection Check
Write-Host "🚀 Starting AgriLink Backend..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Prisma Client
Write-Host "Step 1: Checking Prisma Client..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules\.prisma\client")) {
    Write-Host "   Generating Prisma Client..." -ForegroundColor Cyan
    npm run prisma:generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Prisma Client ready" -ForegroundColor Green

# Step 2: Test MongoDB Connection
Write-Host "`nStep 2: Testing MongoDB connection..." -ForegroundColor Yellow
node test-mongodb-connection.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ MongoDB connection failed!" -ForegroundColor Red
    Write-Host "`n📋 REQUIRED ACTION:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You MUST whitelist your IP address in MongoDB Atlas:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Go to: https://cloud.mongodb.com/" -ForegroundColor White
    Write-Host "2. Click 'Network Access' (left sidebar)" -ForegroundColor White
    Write-Host "3. Click 'Add IP Address'" -ForegroundColor White
    Write-Host "4. Click 'Add Current IP Address' (or add 0.0.0.0/0 for testing)" -ForegroundColor White
    Write-Host "5. Wait 1-2 minutes for changes to take effect" -ForegroundColor White
    Write-Host "6. Run this script again: .\start-with-check.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Quick test: Allow all IPs (0.0.0.0/0) for development" -ForegroundColor Cyan
    Write-Host "   ⚠️  Remember to restrict this later!" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "`n✅ MongoDB connection successful!" -ForegroundColor Green

# Step 3: Push schema if needed
Write-Host "`nStep 3: Checking database schema..." -ForegroundColor Yellow
Write-Host "   (This may take a moment...)" -ForegroundColor Cyan
npx prisma db push --accept-data-loss 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database schema is up to date" -ForegroundColor Green
} else {
    Write-Host "⚠️  Schema push had issues, but continuing..." -ForegroundColor Yellow
}

# Step 4: Start server
Write-Host "`nStep 4: Starting server..." -ForegroundColor Yellow
Write-Host ""
npm run dev
