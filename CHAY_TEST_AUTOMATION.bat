@echo off
chcp 65001 >nul
title PetCare PRO - Test Automation Suite (TestNG + Selenium)

echo ============================================================
echo   PETCARE PRO - TEST AUTOMATION (TESTNG + SELENIUM 4)
echo ============================================================
echo.

cd /d "%~dp0test-automation"
powershell -NoProfile -ExecutionPolicy Bypass -File "run_tests.ps1"

pause
