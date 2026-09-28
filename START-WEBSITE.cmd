@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js 22.13 or newer then open this file again.
  pause
  exit /b 1
)
if not exist node_modules (
  call npm install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
set "BIRTHDAY_PIN=04271005"
echo Open http://localhost:5173 after the server is ready.
call npm run dev
pause
