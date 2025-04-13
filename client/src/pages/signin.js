import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDo8WoY9c_lH-EFKbtg-VVp34JXWcb5Xjo",
  authDomain: "wealthguard-6ae44.firebaseapp.com",
  projectId: "wealthguard-6ae44",
  storageBucket: "wealthguard-6ae44.appspot.com", // düzeltildi
  messagingSenderId: "755180678710",
  appId: "1:755180678710:web:192dc360a5b0a7b324f297"
};

// Firebase başlatma
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const saveFcmToken = async (userId, token) => {
    try {
      await axios.post("http://localhost:5000/api/save-fcm-token", {
        userId,
        token,
      });
      console.log("✅ FCM Token başarıyla kaydedildi:", token);
    } catch (err) {
      console.error("❌ FCM Token kaydedilirken hata:", err);
    }
  };

  const requestFcmToken = async (userId) => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        });
        if (token) {
          await saveFcmToken(userId, token);
        }
      }
    } catch (err) {
      console.error("❌ FCM Token alınamadı:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // FCM Token talep etme ve kaydetme
      await requestFcmToken(response.data.user.id);
      
      // Ana sayfaya yönlendir
      navigate("/dashboard");
    } catch (err) {
      // Hata mesajı yönetimi
      if (err.response) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Sunucu hatası, lütfen tekrar deneyin");
      }
    }
  };
  

  return (
    <div className="h-screen w-screen bg-white flex flex-col font-worksans">
      <nav className="w-full px-10 py-4 flex justify-between items-center bg-gray-100 border-b">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-24 h-24 object-cover" />
          <Link to="/" className="text-5xl italic font-bold text-gray-900">
            WealthGuard
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center flex-1">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px] border-4 border-gray-500">
          <h2 className="text-xl font-semibold text-center">
            Sign in to <span className="font-bold">WealthGuard</span>
          </h2>
          <p className="text-sm text-gray-600 text-center">
            Welcome back! Please sign in to continue.
          </p>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-sm font-medium">E-mail address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button type="submit" className="w-full bg-gray-400 text-black py-2 rounded-lg mt-4">
              Sign In
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Don’t have an account?</span>
            <Link to="/signup" className="font-bold text-black ml-1">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <footer className="w-full bg-gray-100 border-t border-gray-300 py-8">
        <div className="max-w-6xl mx-auto text-center text-xs text-gray-500">
          © 2025 WealthGuard. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
