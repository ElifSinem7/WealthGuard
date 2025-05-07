import React, { createContext, useContext, useState, useEffect } from 'react';
import NotificationService from '../services/notification.service';

// Create the notification context
const NotificationContext = createContext();

// Create the NotificationProvider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    transactions: true,
    marketing: false,
    security: true
  });

  // Load saved notification settings from localStorage
  useEffect(() => {
    const savedNotificationSettings = localStorage.getItem('wealthguard-notifications');
    if (savedNotificationSettings) {
      try {
        const parsedSettings = JSON.parse(savedNotificationSettings);
        setNotificationSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing notification settings:', error);
      }
    }
  }, []);
  
  // Bildirimleri API'den yükle
  useEffect(() => {
    const loadNotifications = async () => {
      // Kullanıcı giriş yapmışsa
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await NotificationService.getAllNotifications();
          setNotifications(data);
        } catch (error) {
          console.error("Bildirimleri yükleme hatası:", error);
        }
      }
    };
    
    loadNotifications();
    
    // Periyodik olarak bildirimleri güncelle (her 30 saniyede bir)
    const interval = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to update notification settings
  const updateNotification = (type, value) => {
    setNotificationSettings(prev => {
      const updated = { ...prev, [type]: value };
      localStorage.setItem('wealthguard-notifications', JSON.stringify(updated));
      return updated;
    });
  };
  
  // Bildirimi okundu olarak işaretle
  const markNotificationAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      
      // UI güncelle
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? {...notification, read: true} : notification
        )
      );
    } catch (error) {
      console.error("Bildirim durumu güncelleme hatası:", error);
    }
  };
  
  // Tüm bildirimleri okundu olarak işaretle
  const markAllNotificationsAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      
      // UI güncelle
      setNotifications(prev => 
        prev.map(notification => ({...notification, read: true}))
      );
    } catch (error) {
      console.error("Bildirimleri güncelleme hatası:", error);
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications,
        notificationSettings, 
        updateNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};