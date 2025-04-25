import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the notification context
const NotificationContext = createContext();

// Create the NotificationProvider component
export const NotificationProvider = ({ children }) => {
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

  // Function to update notification settings
  const updateNotification = (type, value) => {
    setNotificationSettings(prev => {
      const updated = { ...prev, [type]: value };
      localStorage.setItem('wealthguard-notifications', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <NotificationContext.Provider value={{ notificationSettings, updateNotification }}>
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