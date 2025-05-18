require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
})
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ Подключение к PostgreSQL успешно установлено');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Ошибка подключения к PostgreSQL:', error.message);
        return false;
    }
}
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
    testConnection,
};