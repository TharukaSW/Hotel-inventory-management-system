@echo off
echo ========================================
echo Starting Hotel Inventory Management System
echo ========================================

echo.
echo [1/4] Starting MySQL Database...
echo Make sure MySQL is running on localhost:3306
echo Database: hotel_inventory
echo Username: root
echo Password: (empty)
pause

echo.
echo [2/4] Starting Backend Service...
cd "Backend"
start "Backend Service" cmd /k "mvn spring-boot:run"
cd ..

echo.
echo [3/4] Installing Frontend Dependencies...
cd "frontend\micro-frontend\shared-lib"
call npm install
cd "..\admin-service"
call npm install
cd "..\user-service"
call npm install
cd "..\..\..\"

echo.
echo [4/4] Starting Frontend Services...
cd "frontend\micro-frontend\admin-service"
start "Admin Service" cmd /k "npm run dev"
cd "..\user-service"
start "User Service" cmd /k "npm run dev"
cd "..\..\..\"

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Backend API: http://localhost:8082
echo Admin Service: http://localhost:5173
echo User Service: http://localhost:5174
echo Swagger UI: http://localhost:8082/swagger-ui.html
echo.
echo Press any key to exit...
pause > nul
