// Test script to check PyPI connectivity
const axios = require('axios');

async function testPypiConnection() {
    console.log('🧪 Testing PyPI connectivity...\n');
    
    try {
        console.log('1. Testing direct PyPI connection...');
        const response = await axios.get('https://pypi.org/simple/requests/', {
            timeout: 10000,
            headers: {
                'Accept': 'text/html',
                'User-Agent': 'pip/23.0 CodeCache-Pro/1.0.0'
            }
        });
        
        console.log('✅ PyPI connection successful!');
        console.log(`   Status: ${response.status}`);
        console.log(`   Content-Type: ${response.headers['content-type']}`);
        console.log(`   Content length: ${response.data.length} characters`);
        
        // Check if we can find some package links
        const linkCount = (response.data.match(/<a[^>]+href/g) || []).length;
        console.log(`   Found ${linkCount} package links`);
        
        if (linkCount > 0) {
            console.log('✅ PyPI is returning package data correctly');
        } else {
            console.log('⚠️  PyPI response doesn\'t contain expected package links');
        }
        
    } catch (error) {
        console.error('❌ PyPI connection failed:');
        console.error(`   Error: ${error.message}`);
        console.error(`   Code: ${error.code}`);
        
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Status Text: ${error.response.statusText}`);
        }
    }
}

testPypiConnection();