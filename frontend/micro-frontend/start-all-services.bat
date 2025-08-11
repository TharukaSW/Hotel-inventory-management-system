@echo off
echo Starting Hotel Inventory Management System...
echo.

REM Kill any existing processes on the ports
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3003"') do taskkill /PID %%a /F >nul 2>&1

timeout /t 2 >nul

echo.
echo Starting services...
echo.

REM Start Auth Service (Port 3001)
echo Starting Auth Service on port 3001...
start "Auth Service" powershell -Command "cd 'auth-service'; npm run dev"

REM Wait a bit
timeout /t 3 >nul

REM Start Admin Service (Port 3000) 
echo Starting Admin Service on port 3000...
start "Admin Service" powershell -Command "cd 'admin-service'; npm run dev"

REM Wait a bit
timeout /t 3 >nul

REM Start Inspector Service (Port 3002)
echo Starting Inspector Service on port 3002...  
start "Inspector Service" powershell -Command "cd 'inspector-service'; npm run dev"

REM Wait a bit
timeout /t 3 >nul

REM Start Front Desk Service (Port 3003)
echo Starting Front Desk Service on port 3003...
start "Front Desk Service" powershell -Command "cd 'frontdesk-service'; npm run dev"

echo.
echo All services are starting...
echo.
echo Services will be available at:
echo - Auth Service:      http://localhost:3001
echo - Admin Service:     http://localhost:3000  
echo - Inspector Service: http://localhost:3002
echo - Front Desk Service: http://localhost:3003
echo.
echo ===============================================
echo IMPORTANT: AUTHENTICATION IS REQUIRED
echo ===============================================
echo.
echo You MUST start at: http://localhost:3001
echo.
echo Direct access to other services is BLOCKED!
echo - Trying to access localhost:3000 directly = REDIRECT to login
echo - Trying to access localhost:3002 directly = REDIRECT to login
echo - Trying to access localhost:3003 directly = REDIRECT to login
echo.
echo Wait about 30 seconds for all services to fully start.
echo Then open http://localhost:3001 to login and get redirected.
echo.
echo Demo credentials:
echo - admin / admin123     (→ Admin Dashboard on port 3000)
echo - inspector / inspector123  (→ Inspector Dashboard on port 3002)
echo - frontdesk / frontdesk123  (→ Front Desk Dashboard on port 3003)
echo.
pause
