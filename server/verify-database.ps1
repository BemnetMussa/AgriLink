# Verify PostgreSQL Database Schema
Write-Host "🔍 Verifying PostgreSQL Database Schema..." -ForegroundColor Cyan
Write-Host ""

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlPath) {
    Write-Host "⚠️  psql not found in PATH" -ForegroundColor Yellow
    Write-Host "   Using Prisma Studio instead..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opening Prisma Studio..." -ForegroundColor Green
    Write-Host "   This will open a web interface at http://localhost:5555" -ForegroundColor Cyan
    Write-Host "   Press Ctrl+C to stop Prisma Studio" -ForegroundColor Yellow
    Write-Host ""
    npm run prisma:studio
    exit 0
}

# Read .env to get database connection info
$envContent = Get-Content ".env" -Raw
$dbUrl = ""
if ($envContent -match 'DATABASE_URL="([^"]+)"') {
    $dbUrl = $matches[1]
} elseif ($envContent -match 'DATABASE_URL=([^\s]+)') {
    $dbUrl = $matches[1]
}

if (-not $dbUrl) {
    Write-Host "❌ Could not find DATABASE_URL in .env" -ForegroundColor Red
    exit 1
}

# Parse connection string
# Format: postgresql://user:password@host:port/database
$regexPattern = 'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)'
if ($dbUrl -match $regexPattern) {
    $dbUser = $matches[1]
    $dbPass = $matches[2]
    $dbHost = $matches[3]
    $dbPort = $matches[4]
    $dbName = $matches[5]
    
    Write-Host "📊 Database: $dbName" -ForegroundColor Cyan
    Write-Host "📍 Host: $dbHost`:$dbPort" -ForegroundColor Cyan
    Write-Host "👤 User: $dbUser" -ForegroundColor Cyan
    Write-Host ""
    
    # Set PGPASSWORD environment variable
    $env:PGPASSWORD = $dbPass
    
    Write-Host "Listing all tables..." -ForegroundColor Yellow
    Write-Host ""
    
    # List tables
    $tables = psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    
    if ($LASTEXITCODE -eq 0) {
        $tableList = $tables -split "`n" | Where-Object { $_.Trim() -ne "" } | ForEach-Object { $_.Trim() }
        
        if ($tableList.Count -gt 0) {
            Write-Host "✅ Found $($tableList.Count) tables:" -ForegroundColor Green
            Write-Host ""
            foreach ($table in $tableList) {
                Write-Host "   ✓ $table" -ForegroundColor Green
            }
            Write-Host ""
            
            # Show table counts
            Write-Host "📊 Table Record Counts:" -ForegroundColor Cyan
            Write-Host ""
            foreach ($table in $tableList) {
                $count = psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t -c "SELECT COUNT(*) FROM $table;" 2>&1
                if ($LASTEXITCODE -eq 0) {
                    $countNum = ($count -split "`n" | Where-Object { $_.Trim() -ne "" } | Select-Object -First 1).Trim()
                    Write-Host "   $table : $countNum records" -ForegroundColor White
                }
            }
            
            Write-Host ""
            Write-Host "✅ Database schema verified successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "💡 Next steps:" -ForegroundColor Cyan
            Write-Host "   1. Seed database: npm run prisma:seed" -ForegroundColor Yellow
            Write-Host "   2. Start server: npm run dev" -ForegroundColor Yellow
        } else {
            Write-Host "⚠️  No tables found in database" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Failed to connect to database" -ForegroundColor Red
        Write-Host "   Check your DATABASE_URL in .env" -ForegroundColor Yellow
    }
    
    # Clear password
    Remove-Item Env:\PGPASSWORD
} else {
    Write-Host "❌ Could not parse DATABASE_URL" -ForegroundColor Red
    Write-Host "   Expected format: postgresql://user:password@host:port/database" -ForegroundColor Yellow
}
