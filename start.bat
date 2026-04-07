@echo off
title Grawizah - Full Stack Server
color 0A

echo.
echo ============================================
echo   GRAWIZAH - Full Stack Startup Script
echo   B2B Export-Import Intelligence Hub
echo ============================================
echo.

:: Start Backend
echo [1/2] Starting Backend (Go)...
start "Grawizah Backend" cmd /k "cd /d d:\grawizah\backend && go run cmd\main.go"
timeout /t 3 >nul

:: Start Frontend
echo [2/2] Starting Frontend (Next.js)...
start "Grawizah Frontend" cmd /k "cd /d d:\grawizah\frontend && npm run dev"

echo.
echo ============================================
echo   Both servers are starting...
echo ============================================
echo.
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:3000
echo.
echo   Press any key to exit this window...
echo   (Servers will continue running)
echo ============================================
echo.
pause >nul
