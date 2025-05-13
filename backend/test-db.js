const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const pool = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        const [rows] = await pool.query('SELECT 1');
        console.log('Conexión a la base de datos exitosa:', rows);
        pool.end();
    } catch (error) {
        console.error('Fallo en la conexión a la base de datos:', error.message);
    }
}

testConnection();