const { Pool, Client } = require('pg');
const client = new Client({
    user : 'postgres',
    host : 'localhost',
    database : 'opentutorials',
    password : 'jeonhyo251',
    port : 5432,
});
client.connect();
module.exports = client;