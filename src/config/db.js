require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'finance_app',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Bağlantıyı test etme
async function testDBConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL bağlantısı başarılı!');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL bağlantı hatası:', err.message);
  }
}

testDBConnection();

module.exports = db;
