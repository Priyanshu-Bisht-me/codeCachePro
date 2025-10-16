// /backend/src/api/routes.js
// Purpose: Defines all HTTP routes for the backend API.

const express = require('express');
const db = require('../db/database');
const { handleNpmRequest } = require('../fetchers/npmFetcher');
const { getCacheStats, clearCache } = require('../cache/cacheManager');
const logger = require('../middleware/logger');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// NPM registry root endpoint
router.get('/npm', (req, res) => {
    res.status(200).json({ 
        message: 'CodeCache Pro NPM Registry Proxy',
        status: 'ok',
        timestamp: new Date().toISOString(),
        usage: 'Use /npm/<package-name> for package metadata or /npm/<package>/-/<tarball>.tgz for downloads'
    });
});

// NPM proxy endpoint
router.get('/npm/*', handleNpmRequest);
// Block other NPM-related methods to prevent publish attempts
router.all('/npm/*', (req, res) => {
    logger.warn(`Blocked unsupported method ${req.method} for ${req.originalUrl}`);
    res.status(405).json({ error: 'Method Not Allowed. Only GET requests are proxied.' });
});

// Statistics endpoint
router.get('/stats', async (req, res, next) => {
    try {
        const stats = await getCacheStats();
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

// List all cached packages
router.get('/packages', async (req, res, next) => {
    try {
        const packages = await db.all('SELECT * FROM packages ORDER BY name, created_at DESC');
        res.json(packages);
    } catch (error) {
        next(error);
    }
});

// Clear cache endpoint
router.post('/clear-cache', async (req, res, next) => {
    try {
        await clearCache();
        res.status(200).json({ message: 'Cache cleared successfully.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;