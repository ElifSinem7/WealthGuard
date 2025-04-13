// firebase.js
const admin = require("firebase-admin");
const path = require("path");

// Firebase servis hesabı dosyasını bul
const serviceAccount = require(path.join(__dirname, "firebase-service-account.json"));

// Firebase Admin SDK'yı başlat
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wealthguard-6ae44-default-rtdb.firebaseio.com/" // Firebase URL'nizi buraya ekleyin
  });
} else {
  admin.app(); // Eğer Firebase zaten başlatıldıysa mevcut uygulamayı kullan
}

module.exports = admin;
