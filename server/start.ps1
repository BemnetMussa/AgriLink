# AgriLink Backend Startup Script with Error Checking
Write-Host "🚀 Starting AgriLink Backend..." -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if .env exists
Write-Host "`nChecking .env file..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created. Please edit it with your DATABASE_URL!" -ForegroundColor Yellow
        Write-Host "   Press any key to continue after editing .env..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    } else {
        Write-Host "❌ .env.example not found!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

# Check if node_modules exists
Write-Host "`nChecking dependencies..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# Check Prisma Client
Write-Host "`nChecking Prisma Client..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules\.prisma")) {
    Write-Host "⚠️  Prisma Client not generated. Generating..." -ForegroundColor Yellow
    npm run prisma:generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
        Write-Host "   Make sure DATABASE_URL is set in .env" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ Prisma Client ready" -ForegroundColor Green
}

# Create logs directory
Write-Host "`nChecking logs directory..." -ForegroundColor Cyan
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
    Write-Host "✅ Created logs directory" -ForegroundColor Green
} else {
    Write-Host "✅ Logs directory exists" -ForegroundColor Green
}

# Check TypeScript compilation
Write-Host "`nChecking TypeScript compilation..." -ForegroundColor Cyan
$tscCheck = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript compilation OK" -ForegroundColor Green
} else {
    Write-Host "⚠️  TypeScript errors found:" -ForegroundColor Yellow
    Write-Host $tscCheck -ForegroundColor Yellow
    Write-Host "`nContinuing anyway..." -ForegroundColor Yellow
}

# Start server
Write-Host "`n🚀 Starting server..." -ForegroundColor Green
Write-Host "   Server will run on http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop`n" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

npm run dev
