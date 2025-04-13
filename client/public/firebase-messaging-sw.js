importScripts("https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDo8WoY9c_lH-EFKbtg-VVp34JXWcb5Xjo",
    authDomain: "wealthguard-6ae44.firebaseapp.com",
    projectId: "wealthguard-6ae44",
    storageBucket: "wealthguard-6ae44.firebasestorage.app",
    messagingSenderId: "755180678710",
    appId: "1:755180678710:web:192dc360a5b0a7b324f297"
});

const messaging = firebase.messaging();

// Arka planda bildirim almak için listener
messaging.onBackgroundMessage((payload) => {
  console.log("📩 [Service Worker] Arka planda bildirim alındı:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/notification.png", 
  });
});
