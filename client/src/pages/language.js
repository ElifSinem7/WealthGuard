import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // 👈 i18next'ten hook import edildi

// Create the language context
const LanguageContext = createContext();

// Translation data
const translations = {
  English: {
    main: 'Main',
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    payments: 'Payments',
    exchange: 'Exchange',
    others: 'Others',
    settings: 'Settings',
    support: 'Support',
    logout: 'Logout',
    search: 'Search',
    profile: 'Profile',
    security: 'Security',
    appearance: 'Appearance',
    notifications: 'Notifications',
    fullName: 'Full Name',
    displayName: 'Display Name',
    email: 'Email',
    language: 'Language',
    saveChanges: 'Save Changes',
    password: 'Password',
    resetPassword: 'Reset Password',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    blue: 'Blue',
    purple: 'Purple',
    textSize: 'Text Size',
    notificationPreferences: 'Notification Preferences',
    emailNotifications: 'Email Notifications',
    emailNotificationsDesc: 'Receive notifications via email',
    pushNotifications: 'Push Notifications',
    pushNotificationsDesc: 'Receive notifications on your device',
    notificationTypes: 'Notification Types',
    transactionAlerts: 'Transaction Alerts',
    transactionAlertsDesc: 'Get notified about transactions',
    marketingComm: 'Marketing Communications',
    marketingCommDesc: 'Receive marketing and promotional materials',
    securityAlerts: 'Security Alerts',
    securityAlertsDesc: 'Get notified about security-related events'
  },
  Turkish: {
    main: 'Ana',
    dashboard: 'Gösterge Paneli',
    transactions: 'İşlemler',
    payments: 'Ödemeler',
    exchange: 'Döviz',
    others: 'Diğerleri',
    settings: 'Ayarlar',
    support: 'Destek',
    logout: 'Çıkış',
    search: 'Ara',
    profile: 'Profil',
    security: 'Güvenlik',
    appearance: 'Görünüm',
    notifications: 'Bildirimler',
    fullName: 'Tam İsim',
    displayName: 'Görünen İsim',
    email: 'E-posta',
    language: 'Dil',
    saveChanges: 'Değişiklikleri Kaydet',
    password: 'Şifre',
    resetPassword: 'Şifreyi Sıfırla',
    theme: 'Tema',
    light: 'Açık',
    dark: 'Koyu',
    blue: 'Mavi',
    purple: 'Mor',
    textSize: 'Yazı Boyutu',
    notificationPreferences: 'Bildirim Tercihleri',
    emailNotifications: 'E-posta Bildirimleri',
    emailNotificationsDesc: 'E-posta yoluyla bildirim al',
    pushNotifications: 'Anlık Bildirimler',
    pushNotificationsDesc: 'Cihazınızda bildirim alın',
    notificationTypes: 'Bildirim Türleri',
    transactionAlerts: 'İşlem Uyarıları',
    transactionAlertsDesc: 'İşlemler hakkında bilgilendirilme',
    marketingComm: 'Pazarlama İletişimleri',
    marketingCommDesc: 'Pazarlama ve tanıtım materyalleri alın',
    securityAlerts: 'Güvenlik Uyarıları',
    securityAlertsDesc: 'Güvenlikle ilgili olaylar hakkında bilgilendirilme'
  }
};

// Create the LanguageProvider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('wealthguard-language');
    return savedLanguage || 'English';
  });

  const { i18n } = useTranslation(); //

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('wealthguard-language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
