# Quick switch to SQLite for development
Write-Host "🔄 Switching to SQLite for development..." -ForegroundColor Green

# Backup current schema
if (Test-Path "prisma\schema.prisma.backup") {
    Write-Host "Backup already exists" -ForegroundColor Yellow
} else {
    Copy-Item "prisma\schema.prisma" "prisma\schema.prisma.backup"
    Write-Host "✅ Backed up schema to schema.prisma.backup" -ForegroundColor Green
}

# Read current schema
$schema = Get-Content "prisma\schema.prisma" -Raw

# Replace PostgreSQL with SQLite
$schema = $schema -replace 'provider = "postgresql"', 'provider = "sqlite"'
$schema = $schema -replace 'url\s+=\s+env\("DATABASE_URL"\)', 'url      = "file:./dev.db"'

# Write updated schema
Set-Content "prisma\schema.prisma" -Value $schema

Write-Host "✅ Updated schema to use SQLite" -ForegroundColor Green

# Update .env
$envContent = Get-Content ".env" -Raw
$envContent = $envContent -replace 'DATABASE_URL=".*"', 'DATABASE_URL="file:./dev.db"'
Set-Content ".env" -Value $envContent

Write-Host "✅ Updated .env to use SQLite" -ForegroundColor Green

Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run prisma:generate" -ForegroundColor Yellow
Write-Host "2. Run: npm run prisma:migrate" -ForegroundColor Yellow
Write-Host "3. Run: npm run dev" -ForegroundColor Yellow

Write-Host "`n⚠️  Note: SQLite is for development only. Switch back to PostgreSQL for production." -ForegroundColor Yellow
