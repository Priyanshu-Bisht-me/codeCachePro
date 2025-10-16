// /backend/src/cache/pruning.js
// Purpose: Implements automatic cache pruning based on an LRU (Least Recently Used) strategy.

const fsp = require('fs').promises;
const config = require('../../config');
const db = require('../db/database');
const logger = require('../middleware/logger');

async function pruneCache() {
    try {
        const sizeResult = await db.get('SELECT TOTAL(size_bytes) as totalSize FROM packages');
        const currentSize = sizeResult.totalSize || 0;

        if (currentSize <= config.cacheSizeLimitBytes) {
            return; // Nothing to do
        }

        logger.info(`Cache size (${currentSize} bytes) exceeds limit (${config.cacheSizeLimitBytes} bytes). Pruning...`);

        let bytesToFree = currentSize - config.cacheSizeLimitBytes;
        let freedBytes = 0;

        // Find least recently used packages and delete them until we are under the limit
        const packagesToDelete = await db.all(
            'SELECT id, file_path, size_bytes FROM packages ORDER BY last_accessed ASC'
        );

        for (const pkg of packagesToDelete) {
            if (freedBytes >= bytesToFree) {
                break;
            }
            try {
                await fsp.unlink(pkg.file_path);
                await db.serializedRun('DELETE FROM packages WHERE id = ?', [pkg.id]);
                freedBytes += pkg.size_bytes;
                logger.info(`Pruned: ${pkg.file_path} (${pkg.size_bytes} bytes)`);
            } catch (error) {
                // If file doesn't exist, we should still remove DB entry
                if (error.code === 'ENOENT') {
                    await db.serializedRun('DELETE FROM packages WHERE id = ?', [pkg.id]);
                }
                logger.error(`Error pruning file ${pkg.file_path}:`, error);
            }
        }
        logger.info(`Pruning complete. Freed ${freedBytes} bytes.`);
    } catch (error) {
        logger.error('An error occurred during cache pruning:', error);
    }
}

function startPruningInterval(intervalMinutes = 15) {
    const intervalMs = intervalMinutes * 60 * 1000;
    setInterval(pruneCache, intervalMs);
    pruneCache(); // Run once on start
}

module.exports = { pruneCache, startPruningInterval };