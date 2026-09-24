@echo off
echo Installing Lumen LMS dependencies (this may take 2-4 minutes)...
npm.cmd install
if %errorlevel% neq 0 (
  echo FAILED. Check internet connection and try again.
  pause
  exit /b 1
)
echo Done! Run dev server with: npm.cmd run dev
pause
