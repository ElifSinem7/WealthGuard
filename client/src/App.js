import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import HomePage from "./pages/homepage";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import About from "./pages/about";
import ContactUs from "./pages/contactus";
import Support from "./pages/support";
import MainDashboard from "./pages/maindashboard";
import { requestPermissionAndGetToken } from './firebase'; 

function App() {
  useEffect(() => {
    const registerFCMToken = async () => {
      try {
        // Kullanıcıdan izin al ve token'ı al
        const token = await requestPermissionAndGetToken();

        if (!token) {
          console.log('❌ Bildirim izni reddedildi veya token alınamadı.');
          return;
        }

        console.log('✅ Alınan FCM Token:', token);

        // LocalStorage'dan userId'yi al
        const userId = localStorage.getItem('userId');

        if (!userId) {
          console.log('ℹ️ Kullanıcı giriş yapmamış. Token kaydedilmeyecek.');
          return;
        }

        // Token'ı backend'e gönder
        await axios.post('http://localhost:5000/api/notifications/save-fcm-token', {
          userId,
          token
        });

        console.log("✅ FCM token backend'e başarıyla gönderildi.");
      } catch (error) {
        console.error("❌ FCM token gönderiminde hata:", error);
      }
    };

    registerFCMToken();

    // Anlık bildirimleri dinlemek için
    // Bu kısım, frontend'de anlık bildirim alındığında çalışacak.
    // Bu fonksiyonun çalışabilmesi için frontendde FCM yapılandırması gereklidir.
    // Eğer anlık bildirim almayı istiyorsanız, aşağıdaki kodu aktif edebilirsiniz.
    // messaging.onMessage((payload) => {
    //   console.log("📩 Anlık bildirim alındı:", payload);
    // });

  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/support" element={<Support />} />
        <Route path="/maindashboard" element={<MainDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
