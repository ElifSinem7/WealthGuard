import React, { useEffect, useState } from "react";
import AppRoutes from "./routes";
import NotificationModal from "./components/ui/NotificationModal";
import { ThemeLanguageProvider, useThemeLanguage } from "./pages/ThemeLanguageContext";
import { TranslationProvider, useTranslation } from "./pages/TranslationContext";
import { UserProvider } from "./contexts/UserContext"; // Add UserContext provider

// Debug helper to check API connection
const checkApiConnection = async () => {
  try {
    const response = await fetch('/api/health-check');
    console.log('API connection status:', response.ok ? 'Connected' : 'Failed');
    return response.ok;
  } catch (error) {
    console.error('API connection error:', error);
    return false;
  }
};

const LanguageThemeSwitcher = () => {
  const { theme, setTheme } = useThemeLanguage();
  const { language, changeLanguage, isLoading, translateDOM } = useTranslation();

  // Dil değiştirme işleyicisi - translateDOM'u açıkça çağırıyor
  const handleLanguageChange = (newLang) => {
    if (newLang !== language) {
      console.log(`Dil değiştiriliyor: ${language} => ${newLang}`);
      changeLanguage(newLang);
      // Dil değişikliğinden sonra açıkça çeviriyi zorla
      setTimeout(() => {
        console.log("Zorunlu çeviri tetikleniyor");
        translateDOM();
      }, 100);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "5px",
        right: "0px",
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
        zIndex: 1000,
        display: "flex",
        gap: "8px",
        alignItems: "center"
      }}
      className="LanguageThemeSwitcher" // Çeviriden hariç tutulması için sınıf eklendi
    >
      {isLoading && (
        <div style={{ 
          fontSize: "12px", 
          color: theme === "dark" ? "#aaa" : "#666",
          marginRight: "8px"
        }}>
          {language === "TR" ? "Çeviriliyor..." : "Translating..."}
        </div>
      )}
      <button 
        onClick={() => handleLanguageChange("TR")}
        style={{
          backgroundColor: language === "TR" ? (theme === "dark" ? "#555" : "#f0f0f0") : (theme === "dark" ? "#444" : "#fff"),
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "5px 10px",
          cursor: "pointer",
          color: theme === "dark" ? "#fff" : "#000"
        }}
      >
        TR
      </button>
      <button 
        onClick={() => handleLanguageChange("ENG")}
        style={{
          backgroundColor: language === "ENG" ? (theme === "dark" ? "#555" : "#f0f0f0") : (theme === "dark" ? "#444" : "#fff"),
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "5px 10px",
          cursor: "pointer",
          color: theme === "dark" ? "#fff" : "#000"
        }}
      >
        ENG
      </button>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        style={{
          marginLeft: "10px",
          backgroundColor: theme === "dark" ? "#ccc" : "#666",
          padding: "5px 10px",
          borderRadius: "4px",
          border: "none",
          color: theme === "dark" ? "#fff" : "#000"
        }}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
};

function MainApp() {
  const { translateDOM } = useTranslation();
  const [isConnected, setIsConnected] = useState(null);
  
  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkApiConnection();
      setIsConnected(connected);
    };
    
    checkConnection();
  }, []);
  
  // Uygulama yüklendiğinde bir kere DOM çevirisini tetikle
  useEffect(() => {
    // İlk render sonrası çevirme işlemi için
    const timer = setTimeout(() => {
      console.log("App component mounted, initiating translation");
      translateDOM();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [translateDOM]);
  
  // Define theme styles based on context
  const appStyles = {
    backgroundColor: "var(--bg-main)",
    color: "var(--text-main)",
    fontSize: "var(--font-size-base)",
    minHeight: "100vh",
    transition: "background-color 0.3s, color 0.3s"
  };

  return (
    <div style={appStyles}>
      {isConnected === false && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff6b6b",
          color: "white",
          borderRadius: "4px",
          zIndex: 1001
        }}>
          API connection failed. Check your backend server.
        </div>
      )}
      <NotificationModal />
      <AppRoutes />
      <LanguageThemeSwitcher />
    </div>
  );
}

// Context providers ve uygulama birleşimi - Router olmadan
const AppWrapper = () => (
  <ThemeLanguageProvider>
    <TranslationProvider>
      <UserProvider>
        <MainApp />
      </UserProvider>
    </TranslationProvider>
  </ThemeLanguageProvider>
);

export default AppWrapper;