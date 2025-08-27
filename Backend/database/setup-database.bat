@echo off
echo === Hotel Inventory Database Setup ===
echo.

REM Configuration
set DATABASE_NAME=hotel_inventory
set MYSQL_USER=root
set MYSQL_HOST=localhost
set MYSQL_PORT=3306
set SCHEMA_FILE=%~dp0schema.sql

echo Checking if schema file exists...
if not exist "%SCHEMA_FILE%" (
    echo Error: Schema file not found at: %SCHEMA_FILE%
    pause
    exit /b 1
)
echo Schema file found: %SCHEMA_FILE%
echo.

echo Creating database and tables...
echo Please enter your MySQL root password when prompted.
echo.

REM Execute the SQL schema file
mysql --host=%MYSQL_HOST% --port=%MYSQL_PORT% --user=%MYSQL_USER% -p < "%SCHEMA_FILE%"

if %ERRORLEVEL% equ 0 (
    echo.
    echo Database schema created successfully!
    echo.
    echo Verifying database creation...
    mysql --host=%MYSQL_HOST% --port=%MYSQL_PORT% --user=%MYSQL_USER% -p --database=%DATABASE_NAME% -e "SHOW TABLES;"
    echo.
    echo Sample data summary:
    mysql --host=%MYSQL_HOST% --port=%MYSQL_PORT% --user=%MYSQL_USER% -p --database=%DATABASE_NAME% -e "SELECT 'Users' as Table_Name, COUNT(*) as Count FROM users UNION SELECT 'Categories', COUNT(*) FROM categories UNION SELECT 'Suppliers', COUNT(*) FROM suppliers UNION SELECT 'Inventory Items', COUNT(*) FROM inventory_items UNION SELECT 'Frontdesk Records', COUNT(*) FROM frontdesk;"
    echo.
    echo === Database Setup Complete! ===
    echo.
    echo Next steps:
    echo 1. Your application.properties is already configured for MySQL
    echo 2. Start your Spring Boot application
    echo 3. Access the application at http://localhost:8082
    echo.
    echo Default login credentials:
    echo   Admin: admin@hotel.com / password
    echo   Front Desk: frontdesk@hotel.com / password
    echo   Stock Manager: stock@hotel.com / password
    echo   Inspector: inspector@hotel.com / password
) else (
    echo.
    echo Error: Failed to create database schema.
    echo Please check:
    echo   1. MySQL server is running
    echo   2. You entered the correct password
    echo   3. You have privileges to create databases
)

echo.
pause
