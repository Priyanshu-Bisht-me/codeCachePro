// /backend/src/cache/cacheManager.js
// Purpose: Provides functions for managing the cache, such as calculating stats and clearing it.

const fsp = require('fs').promises;
const path = require('path');
const config = require('../../config');
const db = require('../db/database');
const logger = require('../middleware/logger');

let activeDownloads = 0;
let peakConcurrency = 0;

// This is a simple in-memory tracker. For multi-process, use Redis or another shared state manager.
const recordConcurrency = (change) => {
    activeDownloads += change;
    if (activeDownloads < 0) activeDownloads = 0;
    if (activeDownloads > peakConcurrency) {
        peakConcurrency = activeDownloads;
    }
};

const getPeakConcurrency = () => peakConcurrency;

async function getCacheStats() {
    const statsQuery = await db.all('SELECT key, value FROM stats');
    const stats = statsQuery.reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
    }, {});

    const sizeResult = await db.get('SELECT TOTAL(size_bytes) as totalSize FROM packages');
    const numPackagesResult = await db.get('SELECT COUNT(*) as count FROM packages');

    return {
        hits: stats.hits || 0,
        misses: stats.misses || 0,
        bandwidthSaved: stats.bandwidthSaved || 0,
        cacheSizeBytes: sizeResult.totalSize || 0,
        numPackages: numPackagesResult.count || 0,
        peakConcurrency: getPeakConcurrency(),
        activeDownloads,
        cacheSizeLimitBytes: config.cacheSizeLimitBytes,
    };
}

async function clearCache() {
    logger.warn('Clearing the entire cache and database...');
    // Delete files
    await fsp.rm(config.cacheBasePath, { recursive: true, force: true });
    await fsp.mkdir(config.cacheBasePath, { recursive: true });

    // Reset DB
    await db.serializedRun('DELETE FROM packages');
    await db.serializedRun('UPDATE stats SET value = 0');
    
    peakConcurrency = 0; // Reset in-memory peak concurrency
    logger.info('Cache cleared successfully.');
}

module.exports = {
    getCacheStats,
    clearCache,
    recordConcurrency,
    getPeakConcurrency
};