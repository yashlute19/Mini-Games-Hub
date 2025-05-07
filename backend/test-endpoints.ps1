# Test Health Check
Write-Host "`nTesting Health Check Endpoint..." -ForegroundColor Green
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
    Write-Host "Health Check Response: $($healthResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Health Check Failed: $_" -ForegroundColor Red
}

# Test Get Feedbacks
Write-Host "`nTesting Get Feedbacks Endpoint..." -ForegroundColor Green
try {
    $feedbacksResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/feedbacks" -Method Get
    Write-Host "Feedbacks Response: $($feedbacksResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Get Feedbacks Failed: $_" -ForegroundColor Red
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
    Write-Host "Post Feedback Response: $($postResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Post Feedback Failed: $_" -ForegroundColor Red
}

# Test Get Feedbacks Again to verify the new feedback was added
Write-Host "`nVerifying new feedback was added..." -ForegroundColor Green
try {
    $feedbacksResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/feedbacks" -Method Get
    Write-Host "Updated Feedbacks Response: $($feedbacksResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Get Feedbacks Failed: $_" -ForegroundColor Red
} 