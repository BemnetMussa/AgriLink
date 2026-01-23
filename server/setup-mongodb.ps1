# MongoDB Setup Helper
Write-Host "🍃 Setting up MongoDB for AgriLink..." -ForegroundColor Green
Write-Host ""

# Check .env file
Write-Host "Checking .env configuration..." -ForegroundColor Cyan
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match 'DATABASE_URL="mongodb') {
        Write-Host "✅ MongoDB connection string found in .env" -ForegroundColor Green
        
        # Extract connection string
        if ($envContent -match 'DATABASE_URL="([^"]+)"') {
            $dbUrl = $matches[1]
            Write-Host "   Connection: $($dbUrl.Substring(0, [Math]::Min(50, $dbUrl.Length)))..." -ForegroundColor Cyan
        }
    } else {
        Write-Host "⚠️  DATABASE_URL not set to MongoDB" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please update .env with your MongoDB connection string:" -ForegroundColor Yellow
        Write-Host '   DATABASE_URL="mongodb://localhost:27017/agrilink"' -ForegroundColor Cyan
        Write-Host "   Or for MongoDB Atlas:" -ForegroundColor Yellow
        Write-Host '   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/agrilink?retryWrites=true&w=majority"' -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Press any key after updating .env..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
} else {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    exit 1
}

# Generate Prisma Client
Write-Host "`nGenerating Prisma Client..." -ForegroundColor Cyan
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client generated" -ForegroundColor Green

# Push schema to MongoDB
Write-Host "`nPushing schema to MongoDB..." -ForegroundColor Cyan
Write-Host "   This will create collections in your database" -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push schema. Check your DATABASE_URL in .env" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Schema pushed to MongoDB" -ForegroundColor Green

# Ask about seeding
Write-Host "`nWould you like to seed the database with sample data? (y/n)" -ForegroundColor Cyan
$seed = Read-Host
if ($seed -eq 'y' -or $seed -eq 'Y') {
    Write-Host "`nSeeding database..." -ForegroundColor Cyan
    npm run prisma:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database seeded successfully" -ForegroundColor Green
    }
}

Write-Host "`n✅ MongoDB setup complete!" -ForegroundColor Green
Write-Host "`nYou can now start the server:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Yellow
