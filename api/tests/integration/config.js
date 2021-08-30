const request = require('supertest');
const fs = require('fs');
const {Pool} = require('pg');

const server = require('../../server.js');

const testSeed = fs.readFileSync(__dirname + '/test_seeds.sql').toString();

function resetTestDB() {
    return new Promise(async (res, rej) => {
        try {
            const db = new Pool();
            await db.query(testSeed);
            res('Test DB reset');
        } catch (err) {
            console.error(err);
            rej(`Test DB could not be reset: ${err} in ${err.file}`);
        }
    })
}

global.request = request;
global.server = server;
global.resetTestDB = resetTestDB;
global.port = process.env.PORT || 5000;
