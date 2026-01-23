# AgriLink Backend Server Startup Script
Write-Host "🚀 Starting AgriLink Backend Server..." -ForegroundColor Green
Write-Host ""

# Change to server directory
Set-Location $PSScriptRoot

# Check and kill process on port 5000 if needed
Write-Host "🔍 Checking port 5000..." -ForegroundColor Cyan
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "⚠️  Port 5000 is in use. Attempting to free it..." -ForegroundColor Yellow
    foreach ($pid in $process) {
        $procInfo = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($procInfo) {
            Write-Host "   Stopping process: $($procInfo.ProcessName) (PID: $pid)" -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep -Seconds 2
    Write-Host "✅ Port 5000 freed" -ForegroundColor Green
    Write-Host ""
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file with DATABASE_URL and other required variables" -ForegroundColor Yellow
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if Prisma Client is generated
if (-not (Test-Path "node_modules\.prisma")) {
    Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
    npm run prisma:generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Starting server..." -ForegroundColor Green
Write-Host ""

# Start the server
npm run dev
