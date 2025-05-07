@echo off
echo Starting Mini Games Hub Server...

:: Run PowerShell with execution policy bypass
powershell -ExecutionPolicy Bypass -Command "& {Set-Location '%~dp0'; .\start-server.ps1}"

:: Keep the window open if there's an error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo An error occurred while starting the server.
    echo Please make sure Node.js is installed and MongoDB is running.
    echo.
    pause
) 