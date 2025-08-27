# Test script to verify JWT authentication fix
Write-Host "Testing JWT Authentication Fix..." -ForegroundColor Green

# Test login
Write-Host "`nStep 1: Testing login..." -ForegroundColor Yellow
$loginResponse = curl -s -X POST "http://localhost:8082/api/auth/login" -H "Content-Type: application/json" -d '{"email": "sampleadmin@hotel.com", "password": "sampleadmin123"}'
Write-Host "Login Response: $loginResponse"

# Extract token (using simple string parsing)
$token = $loginResponse | Select-String -Pattern '"accessToken":"([^"]*)"' | ForEach-Object { $_.Matches[0].Groups[1].Value }
Write-Host "Extracted Token: $token" -ForegroundColor Cyan

if ($token) {
    # Test inventory endpoint
    Write-Host "`nStep 2: Testing inventory endpoint with JWT..." -ForegroundColor Yellow
    $inventoryResponse = curl -s -X GET "http://localhost:8082/api/inventory" -H "Authorization: Bearer $token"
    Write-Host "Inventory Response: $inventoryResponse"
    
    # Test categories endpoint
    Write-Host "`nStep 3: Testing categories endpoint with JWT..." -ForegroundColor Yellow
    $categoriesResponse = curl -s -X GET "http://localhost:8082/api/categories" -H "Authorization: Bearer $token"
    Write-Host "Categories Response: $categoriesResponse"
    
    # Test suppliers endpoint
    Write-Host "`nStep 4: Testing suppliers endpoint with JWT..." -ForegroundColor Yellow
    $suppliersResponse = curl -s -X GET "http://localhost:8082/api/suppliers" -H "Authorization: Bearer $token"
    Write-Host "Suppliers Response: $suppliersResponse"
} else {
    Write-Host "Failed to extract token from login response" -ForegroundColor Red
}

Write-Host "`nAuthentication test completed!" -ForegroundColor Green
