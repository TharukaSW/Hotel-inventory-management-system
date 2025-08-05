# User Management API Testing Script
# This script tests all user management endpoints with clear status responses

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "User Management API Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8082/api/users"

# Test 1: Get all users
Write-Host "`n1. Testing GET all users..." -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri $baseUrl -Method Get
    Write-Host "✅ SUCCESS: Retrieved $($users.Count) users" -ForegroundColor Green
    $users | Select-Object id, username, firstName, lastName, role, active | Format-Table
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Create a new user
Write-Host "`n2. Testing POST create user..." -ForegroundColor Yellow
$newUser = @{
    username = "testuser$(Get-Random -Maximum 1000)"
    email = "test$(Get-Random -Maximum 1000)@hotel.com"
    password = "password123"
    firstName = "Test"
    lastName = "User"
    role = "FRONT_DESK"
} | ConvertTo-Json

try {
    $createdUser = Invoke-RestMethod -Uri $baseUrl -Method Post -ContentType "application/json" -Body $newUser
    Write-Host "✅ SUCCESS: User created with ID $($createdUser.id)" -ForegroundColor Green
    $testUserId = $createdUser.id
    Write-Host "Created user details:" -ForegroundColor Cyan
    $createdUser | Select-Object id, username, firstName, lastName, role, active | Format-List
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    return
}

# Test 3: Get user by ID
Write-Host "`n3. Testing GET user by ID..." -ForegroundColor Yellow
try {
    $user = Invoke-RestMethod -Uri "$baseUrl/$testUserId" -Method Get
    Write-Host "✅ SUCCESS: Retrieved user with ID $testUserId" -ForegroundColor Green
    $user | Select-Object id, username, firstName, lastName, role, active | Format-List
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Update user
Write-Host "`n4. Testing PUT update user..." -ForegroundColor Yellow
$updateData = @{
    firstName = "Updated Test"
    lastName = "Updated User"
    role = "STOCK_MANAGER"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/$testUserId" -Method Put -ContentType "application/json" -Body $updateData
    Write-Host "✅ SUCCESS: $($response.message)" -ForegroundColor Green
    Write-Host "Status: $($response.status)" -ForegroundColor Cyan
    Write-Host "Updated user details:" -ForegroundColor Cyan
    $response.data | Select-Object id, username, firstName, lastName, role, active | Format-List
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Delete user
Write-Host "`n5. Testing DELETE user..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/$testUserId" -Method Delete
    Write-Host "✅ SUCCESS: $($response.message)" -ForegroundColor Green
    Write-Host "Status: $($response.status)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Verify user is deleted
Write-Host "`n6. Testing GET deleted user (should fail)..." -ForegroundColor Yellow
try {
    $user = Invoke-RestMethod -Uri "$baseUrl/$testUserId" -Method Get
    Write-Host "❌ UNEXPECTED: User still exists after deletion" -ForegroundColor Red
} catch {
    if ($_.Exception.Message -like "*404*") {
        Write-Host "✅ SUCCESS: User correctly deleted (404 Not Found)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAILED: Unexpected error - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 7: Try to delete non-existent user
Write-Host "`n7. Testing DELETE non-existent user..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/999999" -Method Delete
    Write-Host "❌ UNEXPECTED: Delete succeeded for non-existent user" -ForegroundColor Red
} catch {
    $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($errorResponse.status -eq "error") {
        Write-Host "✅ SUCCESS: Correctly handled non-existent user" -ForegroundColor Green
        Write-Host "Status: $($errorResponse.status)" -ForegroundColor Cyan
        Write-Host "Message: $($errorResponse.message)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ FAILED: Unexpected error response" -ForegroundColor Red
    }
}

# Test 8: Try to update non-existent user
Write-Host "`n8. Testing PUT update non-existent user..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/999999" -Method Put -ContentType "application/json" -Body $updateData
    Write-Host "❌ UNEXPECTED: Update succeeded for non-existent user" -ForegroundColor Red
} catch {
    $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($errorResponse.status -eq "error") {
        Write-Host "✅ SUCCESS: Correctly handled non-existent user" -ForegroundColor Green
        Write-Host "Status: $($errorResponse.status)" -ForegroundColor Cyan
        Write-Host "Message: $($errorResponse.message)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ FAILED: Unexpected error response" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "All tests completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
