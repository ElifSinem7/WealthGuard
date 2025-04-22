require('dotenv').config();
const mysql = require('mysql2/promise');

// Veritabanı bağlantı havuzu oluşturuluyor
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',  // Online veritabanı adresi
  user: process.env.DB_USER || 'root',  // PhpMyAdmin kullanıcı adı
  password: process.env.DB_PASSWORD || 'IDCHLIT123456789!!!',  // PhpMyAdmin şifresi
  database: process.env.DB_NAME || 'finance_app',  // Kullanılacak veritabanı adı
  port: process.env.DB_PORT || 3307,  // PhpMyAdmin genellikle 3306 portunu kullanır
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Veritabanı bağlantısını test etmek için bir fonksiyon
async function testDBConnection() {
  try {
    // Bağlantı alınırken bir connection nesnesi elde ediliyor
    const connection = await db.getConnection();
    console.log('✅ MySQL bağlantısı başarılı!');
    connection.release(); // Bağlantıyı serbest bırak
  } catch (err) {
    // Bağlantı hatası durumunda hata mesajı
    console.error('❌ MySQL bağlantı hatası:', err.message);
  }
}

// Bağlantıyı test etme işlemini başlat
testDBConnection();

module.exports = db;
