# MySQL query to check test user
$query = @"
SELECT id, email, username, first_name, last_name, role, is_active 
FROM users 
WHERE email = 'testuser@hotel.com';
"@

# Database connection parameters
$MySQLHost = "localhost"
$MySQLPort = "3306"
$MySQLUser = "root"
$MySQLPass = ""
$MySQLDB = "hotel_inventory"

# Construct MySQL command
$MySQLCmd = "mysql"
$MySQLArgs = "-h $MySQLHost",
             "-P $MySQLPort",
             "-u $MySQLUser",
             "--database=$MySQLDB",
             "-e `"$query`""

if ($MySQLPass) {
    $MySQLArgs += "--password=$MySQLPass"
}

Write-Host "Checking for test user in database..."
Write-Host "Running query: $query"
Write-Host "----------------------------------------"

# Execute MySQL query
& $MySQLCmd $MySQLArgs

Write-Host "----------------------------------------"
