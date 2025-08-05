const fetch = require('node-fetch');

async function testSupplierAPI() {
  try {
    // Test creating a supplier with supply item
    const createResponse = await fetch('http://localhost:8082/api/suppliers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Electronics Supplier',
        email: 'test@electronics.com',
        phoneNumber: '123-456-7890',
        supplyItem: 'Electronics',
        isActive: true
      })
    });

    if (createResponse.ok) {
      const newSupplier = await createResponse.json();
      console.log('✅ Supplier created successfully:');
      console.log('ID:', newSupplier.id);
      console.log('Name:', newSupplier.name);
      console.log('Supply Item:', newSupplier.supplyItem);
      console.log('Email:', newSupplier.email);
      console.log('Phone:', newSupplier.phoneNumber);
    } else {
      console.log('❌ Failed to create supplier:', createResponse.status);
    }

    // Test getting all suppliers
    const getAllResponse = await fetch('http://localhost:8082/api/suppliers');
    if (getAllResponse.ok) {
      const suppliers = await getAllResponse.json();
      console.log('\n✅ Retrieved suppliers:');
      suppliers.forEach(supplier => {
        console.log(`- ${supplier.name} (${supplier.supplyItem || 'No supply item'})`);
      });
    } else {
      console.log('❌ Failed to get suppliers:', getAllResponse.status);
    }

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testSupplierAPI(); 