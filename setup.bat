@echo off
echo 🏏 Setting up Cricket Insights...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python first.
    echo Download from: https://python.org/
    pause
    exit /b 1
)

echo ✅ Node.js and Python are installed!

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Run ETL to process data
echo 📊 Processing cricket data...
node etl/import_kaggle.js

echo ✅ Setup complete!
echo.
echo 🚀 To start the application:
echo    1. Start backend: cd backend && npm run dev
echo    2. Start frontend: cd frontend && npm run dev
echo.
echo 🌐 Access the application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001
echo.
echo 📚 Or run both together:
echo    npm run dev
echo.
pause
