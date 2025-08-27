# Test login with email
$baseUrl = "http://localhost:8080/api"
$loginEndpoint = "$baseUrl/auth/login"

# Test successful login
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "Testing successful login..."
$response = Invoke-RestMethod -Uri $loginEndpoint -Method Post -ContentType "application/json" -Body $loginData -SessionVariable 'session'

Write-Host "Response:"
$response | ConvertTo-Json

# Check if auth-token cookie is present
$authCookie = $session.Cookies.GetCookies($loginEndpoint) | Where-Object { $_.Name -eq "auth-token" }
if ($authCookie) {
    Write-Host "Auth token cookie found: $($authCookie.Value)"
} else {
    Write-Host "No auth token cookie found!"
}

# Test invalid email
$invalidLoginData = @{
    email = "nonexistent@example.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "`nTesting invalid email..."
try {
    $response = Invoke-RestMethod -Uri $loginEndpoint -Method Post -ContentType "application/json" -Body $invalidLoginData
} catch {
    Write-Host "Error response (expected):"
    Write-Host $_.Exception.Response.StatusCode
    Write-Host $_.ErrorDetails.Message
}

# Test invalid password
$invalidPasswordData = @{
    email = "test@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

Write-Host "`nTesting invalid password..."
try {
    $response = Invoke-RestMethod -Uri $loginEndpoint -Method Post -ContentType "application/json" -Body $invalidPasswordData
} catch {
    Write-Host "Error response (expected):"
    Write-Host $_.Exception.Response.StatusCode
    Write-Host $_.ErrorDetails.Message
}
