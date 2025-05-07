# Set execution policy for this process
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Check if .env file exists, if not create it
if (-not (Test-Path .env)) {
    @"
PORT=5000
MONGODB_URI=mongodb+srv://minigameshub:minigameshub123@cluster0.mongodb.net/mini-games-hub?retryWrites=true&w=majority
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Host "Created .env file with default configuration"
}

# Check if node_modules exists, if not install dependencies
if (-not (Test-Path node_modules)) {
    Write-Host "Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies. Please check your internet connection and try again."
        exit 1
    }
}

# Start the server
Write-Host "Starting server..."
Write-Host "Server will be available at: http://localhost:5000"
Write-Host "Health check endpoint: http://localhost:5000/api/health"
Write-Host "Press Ctrl+C to stop the server"

# Start the server with Node.js
node server.js 