@echo off
echo Starting Mini Games Hub Server...

:: Check for administrator privileges
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo This script requires administrator privileges.
    echo Please right-click on this file and select "Run as administrator"
    pause
    exit /b 1
)

:: Check if MongoDB service is running
echo Checking MongoDB service...
sc query MongoDB | find "RUNNING" > nul
if %ERRORLEVEL% NEQ 0 (
    echo MongoDB service is not running. Starting MongoDB...
    net start MongoDB
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to start MongoDB service.
        echo Please make sure MongoDB is installed correctly.
        echo You can download MongoDB from: https://www.mongodb.com/try/download/community
        pause
        exit /b 1
    )
)

:: Kill any existing Node.js process on port 5000
echo Checking for existing server processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Stopping existing server process...
    taskkill /F /PID %%a 2>nul
)

:: Run PowerShell with execution policy bypass
echo Starting server...
powershell -ExecutionPolicy Bypass -Command "& {Set-Location '%~dp0'; .\start-server.ps1}"

:: Keep the window open if there's an error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo An error occurred while starting the server.
    echo Please make sure:
    echo 1. Node.js is installed
    echo 2. MongoDB is installed and running
    echo 3. Port 5000 is available
    echo.
    pause
) 