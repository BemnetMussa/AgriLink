# MongoDB Atlas Connection Fix Script
Write-Host "🔧 MongoDB Atlas Connection Fix" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if mongodb driver is installed
Write-Host "Step 1: Checking MongoDB driver..." -ForegroundColor Yellow
$hasMongoDriver = Test-Path "node_modules\mongodb"

if (-not $hasMongoDriver) {
    Write-Host "   Installing mongodb driver..." -ForegroundColor Cyan
    npm install mongodb --save-dev
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install mongodb driver" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Test connection
Write-Host "`nStep 2: Testing MongoDB connection..." -ForegroundColor Yellow
node test-mongodb-connection.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Connection successful! Pushing schema..." -ForegroundColor Green
    npx prisma db push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 SUCCESS! Your MongoDB is now set up!" -ForegroundColor Green
        Write-Host "`nNext steps:" -ForegroundColor Cyan
        Write-Host "   1. (Optional) Seed database: npm run prisma:seed" -ForegroundColor Yellow
        Write-Host "   2. Start server: npm run dev" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n❌ Connection failed. Most common issue: IP not whitelisted" -ForegroundColor Red
    Write-Host "`n📋 FIX INSTRUCTIONS:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Go to MongoDB Atlas: https://cloud.mongodb.com/" -ForegroundColor Yellow
    Write-Host "2. Click 'Network Access' in left sidebar" -ForegroundColor Yellow
    Write-Host "3. Click 'Add IP Address' button" -ForegroundColor Yellow
    Write-Host "4. Click 'Add Current IP Address' (or add 0.0.0.0/0 for testing)" -ForegroundColor Yellow
    Write-Host "5. Wait 1-2 minutes for changes to take effect" -ForegroundColor Yellow
    Write-Host "6. Run this script again: .\fix-mongodb-connection.ps1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Alternative: Allow all IPs temporarily (0.0.0.0/0)" -ForegroundColor Cyan
    Write-Host "   ⚠️  Remember to restrict this later for production!" -ForegroundColor Red
}
