# Quantum Radio Backend Startup Script
Write-Host "Starting Quantum Radio Backend..." -ForegroundColor Cyan

# Navigate to backend directory
Set-Location backend

# Activate virtual environment if it exists
if (Test-Path "..\venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & "..\venv\Scripts\Activate.ps1"
}

# Start the FastAPI server
Write-Host "Starting FastAPI server with file watching enabled..." -ForegroundColor Green
python main.py 