#!/bin/bash

echo "🔥 Testing JWT Authentication Fix..."

echo "📡 Step 1: Testing login..."
login_response=$(curl -s -X POST "http://localhost:8082/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "sampleadmin@hotel.com", "password": "sampleadmin123"}')

echo "Login Response: $login_response"

# Extract token using grep and sed
token=$(echo "$login_response" | grep -o '"accessToken":"[^"]*"' | sed 's/"accessToken":"\([^"]*\)"/\1/')

if [ ! -z "$token" ]; then
    echo "✅ Token extracted: ${token:0:50}..."
    
    echo "📊 Step 2: Testing inventory endpoint..."
    inventory_response=$(curl -s -X GET "http://localhost:8082/api/inventory" \
      -H "Authorization: Bearer $token")
    echo "Inventory Response: $inventory_response"
    
    echo "📁 Step 3: Testing categories endpoint..." 
    categories_response=$(curl -s -X GET "http://localhost:8082/api/categories" \
      -H "Authorization: Bearer $token")
    echo "Categories Response: $categories_response"
    
    echo "🏪 Step 4: Testing suppliers endpoint..."
    suppliers_response=$(curl -s -X GET "http://localhost:8082/api/suppliers" \
      -H "Authorization: Bearer $token")
    echo "Suppliers Response: $suppliers_response"
    
    # Check for success
    if [[ $inventory_response == *"["* ]] && [[ $categories_response == *"["* ]] && [[ $suppliers_response == *"["* ]]; then
        echo "🎉 SUCCESS: All endpoints returned data arrays!"
        echo "✅ Authentication fix working properly!"
    else
        echo "❌ FAILED: Some endpoints returned errors"
    fi
else
    echo "❌ Failed to extract token"
fi

echo "🏁 Test completed!"
