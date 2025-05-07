@echo off
cd /d "%~dp0"

REM Check if .env exists, if not create it
if not exist .env (
    echo Creating .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://127.0.0.1:27017/mini-games-hub
        echo NODE_ENV=development
    ) > .env
    echo .env file created with contents:
    type .env
)

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    powershell -ExecutionPolicy Bypass -Command "npm install"
    if errorlevel 1 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
)

echo Starting Mini Games Hub Backend Server...
echo.
echo Server will be available at http://localhost:5000
echo Health check: http://localhost:5000/api/health
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server with execution policy bypass
powershell -ExecutionPolicy Bypass -Command "node server.js"
pause 