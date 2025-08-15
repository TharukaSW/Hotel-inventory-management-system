@echo off
echo ========================================
echo Starting Hotel Inventory Management System
echo ========================================

echo.
echo [1/6] Ensure MySQL is running (localhost:3306)
echo Database: hotel_inventory
set /p DUMMY="Press Enter to continue..."

echo.
echo [2/6] Starting Backend Service...
pushd "Backend"
start "Backend Service" cmd /k "mvn spring-boot:run"
popd

echo.
echo [3/6] Installing Frontend Dependencies...
pushd "frontend\micro-frontend\shared-lib"
call npm install
popd
pushd "frontend\micro-frontend\admin-service"
call npm install
popd
pushd "frontend\micro-frontend\user-service"
call npm install
popd
pushd "frontend\micro-frontend\frontdesk-service"
call npm install
popd
pushd "frontend\micro-frontend\inspector-service"
call npm install
popd
pushd "frontend\micro-frontend\shell"
call npm install
popd

echo.
echo [4/6] Building shared library in watch mode...
pushd "frontend\micro-frontend\shared-lib"
start "Shared Lib (tsc --watch)" cmd /k "npm run dev"
popd

echo.
echo [5/6] Starting Frontend Micro-Services...
pushd "frontend\micro-frontend\admin-service"
start "Admin Service (3001)" cmd /k "npm run dev"
popd
pushd "frontend\micro-frontend\user-service"
start "User Service (3000)" cmd /k "npm run dev"
popd
pushd "frontend\micro-frontend\frontdesk-service"
start "Frontdesk Service (3003)" cmd /k "npm run dev"
popd
pushd "frontend\micro-frontend\inspector-service"
start "Inspector Service (3004)" cmd /k "npm run dev"
popd

echo.
echo [6/6] Starting Shell...
pushd "frontend\micro-frontend\shell"
start "Shell (3005)" cmd /k "npm run dev"
popd

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Backend API:        http://localhost:8082
echo Admin Service:      http://localhost:3001
echo User Service:       http://localhost:3000
echo Frontdesk Service:  http://localhost:3003
echo Inspector Service:  http://localhost:3004
echo Shell:              http://localhost:3005
echo Swagger UI:         http://localhost:8082/swagger-ui.html
echo.
echo You can close this window after all terminals have launched.
echo.
