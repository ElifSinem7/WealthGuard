const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Yeni Kullanıcı Ekleme
const createUser = async (name, email, password) => {
  try {
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı backend veritabanına kaydetme
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    return result;
  } catch (error) {
    console.error("Kullanıcı oluşturulamadı:", error.message);
    throw new Error("Kullanıcı oluşturulamadı");
  }
};

module.exports = { createUser };
