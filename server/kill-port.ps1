# Kill process on port 5000
Write-Host "🔍 Checking for processes on port 5000..." -ForegroundColor Cyan

# Find process using port 5000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "⚠️  Found process(es) using port 5000: $($process -join ', ')" -ForegroundColor Yellow
    
    foreach ($pid in $process) {
        $procInfo = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($procInfo) {
            Write-Host "   Killing process: $($procInfo.ProcessName) (PID: $pid)" -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Wait a moment for port to be released
    Start-Sleep -Seconds 2
    
    Write-Host "[OK] Port 5000 should now be free" -ForegroundColor Green
} else {
    Write-Host "[OK] Port 5000 is already free" -ForegroundColor Green
}

Write-Host ""
