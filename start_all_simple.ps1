# Simple PowerShell Start Script
Write-Host "Starting Bridge Resonance project..."

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js not found"
    Read-Host "Press Enter to exit"
    exit 1
}

# Check http-server
if (-not (Get-Command http-server -ErrorAction SilentlyContinue)) {
    Write-Host "Installing http-server..."
    npm install -g http-server
}

# Start services
Write-Host "Starting services..."

# Start homepage
Write-Host "1/4: Starting homepage (8888)..."
Start-Process cmd -ArgumentList "/c cd C:\Users\15722\Desktop\开发\完整网站\总 && http-server -p 8888"
Start-Sleep -Seconds 2

# Start exhibition
Write-Host "2/4: Starting exhibition (3003)..."
Start-Process cmd -ArgumentList "/c cd C:\Users\15722\Desktop\开发\完整网站\总\exhibition && npm run dev"
Start-Sleep -Seconds 3

# Start atlas + AI
Write-Host "3/4: Starting atlas + AI backend (3004/3005)..."
Start-Process cmd -ArgumentList "/c cd C:\Users\15722\Desktop\开发\完整网站\总\atlas && npm run start"
Start-Sleep -Seconds 3

# Start data report
Write-Host "4/4: Starting data report (3006)..."
Start-Process cmd -ArgumentList "/c cd C:\Users\15722\Desktop\开发\完整网站\总\第四页 && http-server -p 3006"
Start-Sleep -Seconds 2

# Open browser
Write-Host "Opening homepage..."
Start-Process "http://localhost:8888"

Write-Host "`nAll services started successfully!`n"
Write-Host "Service addresses:`n"
Write-Host "Homepage: http://localhost:8888`n"
Write-Host "Exhibition: http://localhost:3003`n"
Write-Host "Atlas: http://localhost:3004`n"
Write-Host "AI Backend: http://localhost:3005/health`n"
Write-Host "Data Report: http://localhost:3006`n"

Write-Host "Note: Services are running in background windows`n"
Write-Host "To stop services, close the command windows`n"
Read-Host "Press Enter to exit"
