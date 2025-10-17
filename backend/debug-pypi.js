// Debug script to test PyPI proxy
const axios = require('axios');

async function debugPypi() {
    console.log('🔍 Debugging PyPI proxy...\n');
    
    try {
        // Test 1: Direct PyPI
        console.log('1. Testing direct PyPI...');
        const directResponse = await axios.get('https://pypi.org/simple/numpy/', {
            timeout: 10000,
            headers: { 'Accept': 'text/html' }
        });
        console.log(`✅ Direct PyPI works: ${directResponse.status}, ${directResponse.data.length} chars`);
        
        // Test 2: Our proxy
        console.log('\n2. Testing our proxy...');
        const proxyResponse = await axios.get('http://localhost:5050/pypi/numpy/', {
            timeout: 10000,
            headers: { 'Accept': 'text/html' }
        });
        console.log(`✅ Our proxy works: ${proxyResponse.status}, ${proxyResponse.data.length} chars`);
        
        // Test 3: Compare content
        console.log('\n3. Comparing content...');
        if (directResponse.data === proxyResponse.data) {
            console.log('✅ Content matches perfectly!');
        } else {
            console.log('⚠️  Content differs');
            console.log(`Direct first 200 chars: ${directResponse.data.substring(0, 200)}`);
            console.log(`Proxy first 200 chars: ${proxyResponse.data.substring(0, 200)}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
        }
    }
}

debugPypi();