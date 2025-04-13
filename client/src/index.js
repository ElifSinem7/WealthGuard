import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { messaging } from './firebase';

// Service Worker'ı Kayıt Et
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ Service Worker kaydedildi:", registration);
    })
    .catch((err) => {
      console.error("❌ Service Worker kaydedilirken hata:", err);
    });
}

// Firebase'den Bildirim Token'ı Al
const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await messaging.getToken();
      console.log("📲 Bildirim Token:", token);
      localStorage.setItem("fcm_token", token);
    } else {
      console.warn("❌ Bildirim izni reddedildi.");
    }
  } catch (error) {
    console.error("❌ Bildirim token alınırken hata:", error);
  }
};

requestNotificationPermission();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
