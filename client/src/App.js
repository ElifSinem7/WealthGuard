import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import NotificationModal from "./components/ui/NotificationModal";
import { ThemeLanguageProvider, useThemeLanguage } from "./pages/ThemeLanguageContext";

const LanguageThemeSwitcher = () => {
  const { theme, setTheme, language, setLanguage } = useThemeLanguage();

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
        gap: "8px"
      }}
    >
      <button 
        onClick={() => setLanguage("TR")}
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
        onClick={() => setLanguage("ENG")}
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

function App() {

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
      <NotificationModal />
      <AppRoutes />
      <LanguageThemeSwitcher />
    </div>
  );
}

const AppWrapper = () => (
  <ThemeLanguageProvider>
    <Router>
      <App />
    </Router>
  </ThemeLanguageProvider>
);

export default AppWrapper;