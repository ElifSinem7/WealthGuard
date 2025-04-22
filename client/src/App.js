import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import HomePage from "./pages/homepage";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import About from "./pages/about";
import ContactUs from "./pages/contactus";
import Support from "./pages/support";
import FAQ from "./pages/faq";
import Payments from "./pages/payments";
import PaMod from "./pages/paymod";
import Exchange from "./pages/exchange";
import Settings from "./pages/settings";
import MainDashboard from "./pages/maindashboard";
import Modal from "./pages/AddTransactionModal";
import RecurringTransactions from "./pages/recurringTransactionPage";
import NotificationModal from "./components/ui/NotificationModal"; // Yeni eklediğimiz modal bileşeni
import 'material-icons/iconfont/material-icons.css';

// Socket.io server adresi
const socket = io("http://localhost:5000");

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Socket.io ile bildirim almak
    socket.on("notification", (message) => {
      // Yeni bildirimi ekle
      const newNotification = { message: message, date: new Date().toLocaleString() };
      setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
      setOpenModal(true); // Modalı aç
    });

    // Cleanup: Component unmount olduğunda socket bağlantısını temizle
    return () => {
      socket.off("notification");
    };
  }, []);

  const closeModal = () => {
    setOpenModal(false); // Modalı kapat
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/support" element={<Support />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/paymod" element={<PaMod />} />
        <Route path="/AddTransactionModal" element={<Modal />} />
        <Route path="/maindashboard" element={<MainDashboard />} />
        <Route path="/recurringTransactionPage" element={<RecurringTransactions />} />
      </Routes>

      {/* Bildirim modalını ekliyoruz */}
      <NotificationModal open={openModal} onClose={closeModal} notifications={notifications} />
    </Router>
  );
}

export default App;
