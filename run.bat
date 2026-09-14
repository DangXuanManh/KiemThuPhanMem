@echo off
title PetCare Store Launcher
chcp 65001 >nul
echo ========================================================
echo   🚀 ĐANG KHỞI CHẠY HỆ THỐNG PETCARE STORE (1-CLICK RUN)
echo ========================================================
echo.
echo 1. Đang khởi chạy Backend Server (Port 5000)...
start "PetCare Backend Server" cmd /k "cd /d "%~dp0backend" && npm start"

echo 2. Đang khởi chạy Frontend Web App (Port 3000)...
start "PetCare Frontend App" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo 3. Đang mở trình duyệt Web tự động...
timeout /t 3 >nul
start http://localhost:3000
start http://localhost:5000/api-docs

echo.
echo ========================================================
echo   ✅ ĐÃ KHỞI CHẠY THÀNH CÔNG HỆ THỐNG!
echo   - Giao diện Web: http://localhost:3000
echo   - Swagger API Docs: http://localhost:5000/api-docs
echo ========================================================
