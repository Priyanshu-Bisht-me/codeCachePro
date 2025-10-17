// Simple test to verify PyPI proxy works
const express = require('express');
const axios = require('axios');

const app = express();

// Simple PyPI proxy
app.get('/pypi/*', async (req, res) => {
    try {
        const path = req.params[0] || '';
        console.log(`Request: ${req.originalUrl} -> ${path}`);
        
        // Handle root request
        if (!path) {
            return res.json({ message: 'PyPI Proxy', status: 'ok' });
        }
        
        // Clean path and ensure it ends with / for package index
        let cleanPath = path.replace(/^\/+|\/+$/g, '');
        if (!cleanPath.includes('.') && !cleanPath.endsWith('/')) {
            cleanPath += '/';
        }
        
        const upstreamUrl = `https://pypi.org/simple/${cleanPath}`;
        console.log(`Fetching: ${upstreamUrl}`);
        
        const response = await axios.get(upstreamUrl, {
            timeout: 15000,
            headers: {
                'Accept': 'text/html',
                'User-Agent': 'pip/23.0'
            }
        });
        
        console.log(`Success: ${response.status}, ${response.data.length} chars`);
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(response.data);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.get('/pypi', (req, res) => {
    res.json({ message: 'PyPI Proxy Test Server', status: 'ok' });
});

const server = app.listen(5051, () => {
    console.log('🧪 Simple PyPI test server running on http://localhost:5051');
    console.log('Test with: pip install --trusted-host localhost --index-url http://localhost:5051/pypi numpy');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down test server...');
    server.close();
    process.exit(0);
});