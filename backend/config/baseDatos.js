const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'Rezips',
    user: 'postgres',
    password: 'EzePas010725'
});

module.exports = pool;