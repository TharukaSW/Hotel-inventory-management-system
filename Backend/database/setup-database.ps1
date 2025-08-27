# Hotel Inventory Database Setup Script
# This script creates the MySQL database and tables for the hotel inventory system

Write-Host "=== Hotel Inventory Database Setup ===" -ForegroundColor Green
Write-Host ""

# Configuration
$DatabaseName = "hotel_inventory"
$MySQLUser = "root"
$MySQLHost = "localhost"
$MySQLPort = "3306"
$SchemaFile = Join-Path $PSScriptRoot "schema.sql"

# Check if MySQL is accessible
Write-Host "Checking MySQL connection..." -ForegroundColor Yellow
try {
    # Test MySQL connection
    Write-Host "Please enter MySQL root password when prompted..." -ForegroundColor Cyan
    $testResult = mysql --host=$MySQLHost --port=$MySQLPort --user=$MySQLUser -p -e "SELECT 1;" 2>$null
    Write-Host "MySQL connection successful!" -ForegroundColor Green
} catch {
    Write-Host "Error: Cannot connect to MySQL server." -ForegroundColor Red
    Write-Host "Please make sure:" -ForegroundColor Yellow
    Write-Host "  1. MySQL server is running" -ForegroundColor Yellow
    Write-Host "  2. MySQL client is installed and in PATH" -ForegroundColor Yellow
    Write-Host "  3. You have the correct credentials" -ForegroundColor Yellow
    exit 1
}

# Check if schema file exists
if (-not (Test-Path $SchemaFile)) {
    Write-Host "✗ Error: Schema file not found at: $SchemaFile" -ForegroundColor Red
    exit 1
}

Write-Host "Schema file found: $SchemaFile" -ForegroundColor Green

# Execute the schema creation
Write-Host ""
Write-Host "Creating database and tables..." -ForegroundColor Yellow
try {
    # Execute the SQL schema file
    mysql --host=$MySQLHost --port=$MySQLPort --user=$MySQLUser --password < $SchemaFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database schema created successfully!" -ForegroundColor Green
    } else {
        throw "SQL execution failed with exit code: $LASTEXITCODE"
    }
} catch {
    Write-Host "✗ Error creating database schema: $_" -ForegroundColor Red
    exit 1
}

# Verify database and tables creation
Write-Host ""
Write-Host "Verifying database creation..." -ForegroundColor Yellow
try {
    $tableCount = mysql --host=$MySQLHost --port=$MySQLPort --user=$MySQLUser --password --database=$DatabaseName --execute="SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DatabaseName';" --silent --raw 2>$null
    
    if ($tableCount -gt 0) {
        Write-Host "✓ Database '$DatabaseName' created with $tableCount tables!" -ForegroundColor Green
        
        # List all tables
        Write-Host ""
        Write-Host "Tables created:" -ForegroundColor Cyan
        $tables = mysql --host=$MySQLHost --port=$MySQLPort --user=$MySQLUser --password --database=$DatabaseName --execute="SHOW TABLES;" --silent --raw 2>$null
        $tables -split "`n" | ForEach-Object { 
            if ($_ -ne "") { 
                Write-Host "  • $_" -ForegroundColor White
            } 
        }
    } else {
        Write-Host "✗ Warning: No tables found in database!" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Error verifying database: $_" -ForegroundColor Red
}

# Show sample data counts
Write-Host ""
Write-Host "Sample data summary:" -ForegroundColor Cyan
try {
    $userCount = mysql --host=$MySQLHost --port=$MySQLPort --user=$MySQLUser --password --database=$DatabaseName --execute="SELECT COUNT(*) FROM users;" --silent --raw 2>$null
    $categoryCount = mysql --host=$MySQLHost --port=$MySQLPort --user=$MySQLUser --password --database=$DatabaseName --execute="SELECT COUNT(*) FROM categories;" --silent --raw 2>$null
    $supplierCount = mysql --host=$MySQLHost --port=$MySQLPort --user=$MySQLUser --password --database=$DatabaseName --execute="SELECT COUNT(*) FROM suppliers;" --silent --raw 2>$null
    $inventoryCount = mysql --host=$MySQLHost --port=$MySQLPort --user=$MySQLUser --password --database=$DatabaseName --execute="SELECT COUNT(*) FROM inventory_items;" --silent --raw 2>$null
    $frontdeskCount = mysql --host=$MySQLHost --port=$MySQLPort --user=$MySQLUser --password --database=$DatabaseName --execute="SELECT COUNT(*) FROM frontdesk;" --silent --raw 2>$null
    
    Write-Host "  • Users: $userCount" -ForegroundColor White
    Write-Host "  • Categories: $categoryCount" -ForegroundColor White
    Write-Host "  • Suppliers: $supplierCount" -ForegroundColor White
    Write-Host "  • Inventory Items: $inventoryCount" -ForegroundColor White
    Write-Host "  • Frontdesk Records: $frontdeskCount" -ForegroundColor White
} catch {
    Write-Host "  Could not retrieve data counts" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Database Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update your application.properties to use MySQL" -ForegroundColor White
Write-Host "2. Start your Spring Boot application" -ForegroundColor White
Write-Host "3. Access the application at http://localhost:8082" -ForegroundColor White
Write-Host ""
Write-Host "Default login credentials:" -ForegroundColor Cyan
Write-Host "  Admin: admin@hotel.com / password" -ForegroundColor White
Write-Host "  Front Desk: frontdesk@hotel.com / password" -ForegroundColor White
Write-Host "  Stock Manager: stock@hotel.com / password" -ForegroundColor White
Write-Host "  Inspector: inspector@hotel.com / password" -ForegroundColor White
