# Riverwood AI Voice Agent Start Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Riverwood AI Voice Agent" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if dependencies are installed
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Backend dependencies not found. Running setup..." -ForegroundColor Yellow
    .\setup.ps1
}

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Frontend dependencies not found. Running setup..." -ForegroundColor Yellow
    .\setup.ps1
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "✗ .env file not found. Please run setup.ps1 first!" -ForegroundColor Red
    exit 1
}

Write-Host "Starting services..." -ForegroundColor Yellow
Write-Host ""

# Start backend in new window
Write-Host "Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'Backend Server' -ForegroundColor Cyan; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in new window
Write-Host "Starting frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Frontend Server' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Services Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend: http://localhost:3001" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop all node processes (optional - be careful with this)
Write-Host "Stopping services..." -ForegroundColor Yellow
# Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "Please close the terminal windows manually." -ForegroundColor Yellow
