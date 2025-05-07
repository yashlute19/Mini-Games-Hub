# Start the server in a new window
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -Command `"cd '$PWD'; node server.js`"" -WindowStyle Normal

# Wait for server to start
Write-Host "Waiting for server to start..."
Start-Sleep -Seconds 5

Write-Host "`nTesting endpoints...`n"

# Test Health Check
Write-Host "Testing Health Check Endpoint..." -ForegroundColor Green
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
    Write-Host "Health Check Response:" -ForegroundColor Green
    Write-Host ($healthResponse | ConvertTo-Json)
} catch {
    Write-Host "Health Check Failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test Get Feedbacks
Write-Host "`nTesting Get Feedbacks Endpoint..." -ForegroundColor Green
try {
    $feedbacksResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/feedbacks" -Method Get
    Write-Host "Feedbacks Response:" -ForegroundColor Green
    Write-Host ($feedbacksResponse | ConvertTo-Json)
} catch {
    Write-Host "Get Feedbacks Failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test Post Feedback
Write-Host "`nTesting Post Feedback Endpoint..." -ForegroundColor Green
$feedbackData = @{
    username = "TestUser"
    rating = 5
    review = "This is a test feedback"
} | ConvertTo-Json

try {
    $postResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/feedbacks" -Method Post -Body $feedbackData -ContentType "application/json"
    Write-Host "Post Feedback Response:" -ForegroundColor Green
    Write-Host ($postResponse | ConvertTo-Json)
} catch {
    Write-Host "Post Feedback Failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Verify new feedback
Write-Host "`nVerifying new feedback was added..." -ForegroundColor Green
try {
    $feedbacksResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/feedbacks" -Method Get
    Write-Host "Updated Feedbacks Response:" -ForegroundColor Green
    Write-Host ($feedbacksResponse | ConvertTo-Json)
} catch {
    Write-Host "Get Feedbacks Failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host "`nTests completed. Press any key to close the server window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Kill the server process
Get-Process | Where-Object { $_.MainWindowTitle -eq "Mini Games Hub Server" } | Stop-Process -Force 