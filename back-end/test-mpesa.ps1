# test-mpesa.ps1 - Permanent MPesa Test Script

# Colors for output
$Green = 'Green'
$Red = 'Red'
$Yellow = 'Yellow'

Write-Host "🌾 AgriPay MPesa Test Script" -ForegroundColor $Green
Write-Host "=========================================" -ForegroundColor $Yellow

try {
    # Step 1: Login to get token
    Write-Host "`n1. Getting authentication token..." -ForegroundColor $Yellow
    
    $loginBody = @{
        email = "test@agripay.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Headers @{"Content-Type"="application/json"} -Body $loginBody
    
    $token = $loginResponse.data.token
    Write-Host "   ✅ Token obtained successfully" -ForegroundColor $Green

    # Step 2: Test MPesa
    Write-Host "`n2. Testing MPesa integration..." -ForegroundColor $Yellow
    
    $mpesaBody = @{
        amount = 1
        phoneNumber = "254708374149"
        description = "Test MPesa Payment"
        orderType = "input_purchase"
        productName = "Test Seeds"
    } | ConvertTo-Json

    $mpesaResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/mpesa/initialize" -Method Post -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $token"} -Body $mpesaBody
    
    Write-Host "   ✅ MPesa test successful!" -ForegroundColor $Green
    Write-Host "`n📊 Response:" -ForegroundColor $Yellow
    Write-Host ($mpesaResponse | ConvertTo-Json -Depth 4) -ForegroundColor White

} catch {
    Write-Host "   ❌ Test failed:" -ForegroundColor $Red
    Write-Host $_.Exception.Message -ForegroundColor $Red
}

Write-Host "`n=========================================" -ForegroundColor $Yellow
Write-Host "Test completed. Run this script anytime!" -ForegroundColor $Green