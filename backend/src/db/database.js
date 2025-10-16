// /backend/src/db/database.js
// Purpose: Manages the SQLite database connection and operations.
// Provides promise-based wrappers for DB queries and ensures serial execution for writes.

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');
const logger = require('../middleware/logger');

let db;

const connectDb = () => {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(config.databasePath, (err) => {
            if (err) {
                logger.error('Could not connect to database', err);
                reject(err);
            } else {
                logger.info('Connected to SQLite database.');
                resolve();
            }
        });
    });
};

const initDb = async () => {
    if (!db) {
        await connectDb();
    }
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf-8');
    return new Promise((resolve, reject) => {
        db.exec(schema, (err) => {
            if (err) {
                logger.error('Error executing DB schema', err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                logger.error(`Error running sql: ${sql} with params: ${params}`, err);
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, result) => {
            if (err) {
                logger.error(`Error running sql: ${sql} with params: ${params}`, err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                logger.error(`Error running sql: ${sql} with params: ${params}`, err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const closeDb = () => {
    db.close((err) => {
        if (err) {
            logger.error('Error closing the database connection', err);
        } else {
            logger.info('Database connection closed.');
        }
    });
};

// Use serialize to ensure that writes happen sequentially to prevent corruption
const serializedRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(sql, params, function(err) {
                if (err) {
                    logger.error(`Error in serialized run: ${sql}`, err);
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    });
};


module.exports = { initDb, run, get, all, closeDb, serializedRun };