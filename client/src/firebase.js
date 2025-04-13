import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import { PushNotifications } from '@capacitor/push-notifications';

// 🔐 Firebase projenize ait yapılandırma bilgileri
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// 🔧 Firebase başlat
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ✅ Bildirim izni al, token oluştur ve sunucuya gönder
export const requestPermissionAndGetToken = async (userId) => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("📛 Bildirim izni reddedildi.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    });
    console.log("🎯 Gerçek FCM token:", token);

    if (!token || token.length < 100) {
      console.error("❌ Geçersiz veya boş FCM token alındı:", token);
      return null;
    }

    console.log("📱 FCM Token alındı:", token);

    // Backend'e token'ı gönder
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    try {
      await axios.post(`${API_URL}/api/notifications/save-token`, {
        userId,
        token,
      });
      console.log("✅ Token backend'e başarıyla gönderildi.");
    } catch (error) {
      console.error("❌ Token backend'e gönderilemedi:", error.response?.data || error.message);
    }

    return token;

  } catch (error) {
    console.error("❌ Token alınamadı:", error);
    return null;
  }
};

// 📨 Tarayıcı açıkken gelen bildirimleri dinle
onMessage(messaging, (payload) => {
  console.log("📩 Gelen bildirim:", payload);

  const { title, body, icon } = payload.notification;

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: icon || "/logo192.png", // varsayılan ikon eklenebilir
    });
  } else {
    alert(`📢 Yeni Bildirim: ${title}`);
  }
});
PushNotifications.addListener("registration", (token) => {      
  if (token && !this.tokenProcessed) {
    this.tokenProcessed = true;
    console.log('My token: ' + JSON.stringify(token));
    this.onFCMTokenChanged.next(token.value);
  }
});

export { messaging }; 
