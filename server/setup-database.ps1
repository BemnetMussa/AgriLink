# Database Setup Helper Script
Write-Host "🗄️  AgriLink Database Setup" -ForegroundColor Green
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Cyan
$pgService = Get-Service -Name postgresql* -ErrorAction SilentlyContinue

if ($pgService) {
    Write-Host "✅ PostgreSQL service found: $($pgService.Name)" -ForegroundColor Green
    
    # Check if running
    if ($pgService.Status -eq 'Running') {
        Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PostgreSQL is not running. Attempting to start..." -ForegroundColor Yellow
        try {
            Start-Service $pgService.Name
            Write-Host "✅ PostgreSQL started" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to start PostgreSQL. Please start it manually." -ForegroundColor Red
            Write-Host "   You can start it from Services (services.msc) or run:" -ForegroundColor Yellow
            Write-Host "   Start-Service $($pgService.Name)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ PostgreSQL not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PostgreSQL:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "2. Install with default settings" -ForegroundColor Yellow
    Write-Host "3. Remember the password you set for 'postgres' user" -ForegroundColor Yellow
    Write-Host "4. Run this script again" -ForegroundColor Yellow
    exit 1
}

# Check if psql is available
Write-Host "`nChecking psql command..." -ForegroundColor Cyan
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlPath) {
    Write-Host "⚠️  psql command not found in PATH" -ForegroundColor Yellow
    Write-Host "   You may need to add PostgreSQL bin to PATH:" -ForegroundColor Yellow
    Write-Host "   Usually: C:\Program Files\PostgreSQL\16\bin" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Or use pgAdmin to create the database manually" -ForegroundColor Yellow
} else {
    Write-Host "✅ psql found" -ForegroundColor Green
}

# Check .env file
Write-Host "`nChecking .env configuration..." -ForegroundColor Cyan
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match 'DATABASE_URL="postgresql://') {
        Write-Host "✅ DATABASE_URL found in .env" -ForegroundColor Green
        
        # Extract database name
        if ($envContent -match '/(\w+)\?schema') {
            $dbName = $matches[1]
            Write-Host "   Database name: $dbName" -ForegroundColor Cyan
            
            Write-Host "`nTo create the database, run:" -ForegroundColor Yellow
            Write-Host "   psql -U postgres -c `"CREATE DATABASE $dbName;`"" -ForegroundColor Cyan
        }
    } else {
        Write-Host "⚠️  DATABASE_URL not properly configured in .env" -ForegroundColor Yellow
        Write-Host "   Please update .env with:" -ForegroundColor Yellow
        Write-Host "   DATABASE_URL=`"postgresql://postgres:YOUR_PASSWORD@localhost:5432/agrilink?schema=public`"" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    Write-Host "   Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "   Please edit .env and set DATABASE_URL" -ForegroundColor Yellow
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Green
Write-Host "1. Make sure PostgreSQL is running (✅ checked above)" -ForegroundColor Cyan
Write-Host "2. Create database: CREATE DATABASE agrilink;" -ForegroundColor Cyan
Write-Host "3. Update .env with your PostgreSQL password" -ForegroundColor Cyan
Write-Host "4. Run: npm run prisma:migrate" -ForegroundColor Cyan
Write-Host "5. Run: npm run dev" -ForegroundColor Cyan
