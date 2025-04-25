import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from './routes';
import NotificationModal from "./components/ui/NotificationModal";
import Layout from "./components/layout";
import { SettingsProvider } from './SettingsContext';

function App() {
  
  const [openModal, setOpenModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <SettingsProvider>
    <Router>
      <Layout>
        <AppRoutes />
        <NotificationModal open={openModal} onClose={closeModal} notifications={notifications} />
      </Layout>
    </Router>
    </SettingsProvider>
  );
}

export default App;
