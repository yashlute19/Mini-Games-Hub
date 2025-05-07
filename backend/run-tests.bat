@echo off
cd /d "%~dp0"

echo Starting Mini Games Hub Backend Server...
echo.

REM Start the server in a new window with execution policy bypass
start "Mini Games Hub Server" powershell -ExecutionPolicy Bypass -Command "node server.js"

REM Wait for server to start
echo Waiting for server to start...
timeout /t 5 /nobreak

echo.
echo Testing endpoints...
echo.

REM Run the tests with execution policy bypass
powershell -ExecutionPolicy Bypass -Command "& {
    $ErrorActionPreference = 'Stop'
    
    Write-Host 'Testing Health Check Endpoint...' -ForegroundColor Green
    try {
        $healthResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -Method Get
        Write-Host 'Health Check Response:' -ForegroundColor Green
        Write-Host ($healthResponse | ConvertTo-Json)
    } catch {
        Write-Host 'Health Check Failed:' -ForegroundColor Red
        Write-Host $_.Exception.Message
    }

    Write-Host '`nTesting Get Feedbacks Endpoint...' -ForegroundColor Green
    try {
        $feedbacksResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/feedbacks' -Method Get
        Write-Host 'Feedbacks Response:' -ForegroundColor Green
        Write-Host ($feedbacksResponse | ConvertTo-Json)
    } catch {
        Write-Host 'Get Feedbacks Failed:' -ForegroundColor Red
        Write-Host $_.Exception.Message
    }

    Write-Host '`nTesting Post Feedback Endpoint...' -ForegroundColor Green
    $feedbackData = @{
        username = 'TestUser'
        rating = 5
        review = 'This is a test feedback'
    } | ConvertTo-Json

    try {
        $postResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/feedbacks' -Method Post -Body $feedbackData -ContentType 'application/json'
        Write-Host 'Post Feedback Response:' -ForegroundColor Green
        Write-Host ($postResponse | ConvertTo-Json)
    } catch {
        Write-Host 'Post Feedback Failed:' -ForegroundColor Red
        Write-Host $_.Exception.Message
    }

    Write-Host '`nVerifying new feedback was added...' -ForegroundColor Green
    try {
        $feedbacksResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/feedbacks' -Method Get
        Write-Host 'Updated Feedbacks Response:' -ForegroundColor Green
        Write-Host ($feedbacksResponse | ConvertTo-Json)
    } catch {
        Write-Host 'Get Feedbacks Failed:' -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}"

echo.
echo Tests completed. Press any key to close the server window...
pause

REM Kill the server process
taskkill /F /FI "WINDOWTITLE eq Mini Games Hub Server" /T 