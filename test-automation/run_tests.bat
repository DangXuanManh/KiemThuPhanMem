@echo off
chcp 65001 >nul
title PetCare PRO - Test Automation Runner (TestNG + Selenium)

echo ============================================================
echo   PETCARE PRO - TEST AUTOMATION (TESTNG + SELENIUM 4)
echo ============================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run_tests.ps1"

pause
