// src/pages/ThemeLanguageContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import SettingService from "../services/setting.service"; // Dosya yolunu düzelttim

// Create context
export const ThemeLanguageContext = createContext();

// Provider component
export const ThemeLanguageProvider = ({ children }) => {
  // Get theme from localStorage or default to "light"
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("wealthguard-theme-mode") || "light";
  });

  // Get color theme from localStorage or default to "purple"
  const [colorTheme, setColorTheme] = useState(() => {
    return localStorage.getItem("wealthguard-color-theme") || "purple";
  });

  // Get font size from localStorage or default to "medium"
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("wealthguard-font-size") || "medium";
  });

  // Get language from localStorage or default to "ENG"
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("wealthguard-language") || "ENG";
  });

  // Font size mapping
  const fontSizes = {
    small: "0.75rem",
    medium: "1rem",
    large: "1.5rem",
  };

  // API'den kullanıcı ayarlarını yükle
  useEffect(() => {
    const loadUserSettings = async () => {
      // Kullanıcı giriş yapmışsa
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const settings = await SettingService.getSettings();
          
          if (settings.theme) {
            setTheme(settings.theme);
            localStorage.setItem("wealthguard-theme-mode", settings.theme);
          }
          
          if (settings.color_theme) {
            setColorTheme(settings.color_theme);
            localStorage.setItem("wealthguard-color-theme", settings.color_theme);
          }
          
          if (settings.font_size) {
            setFontSize(settings.font_size);
            localStorage.setItem("wealthguard-font-size", settings.font_size);
          }
          
          if (settings.language) {
            setLanguage(settings.language);
            localStorage.setItem("wealthguard-language", settings.language);
          }
        } catch (error) {
          console.error("Kullanıcı ayarları yükleme hatası:", error);
        }
      }
    };
    
    loadUserSettings();
  }, []);

  // Apply theme effects globally
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("wealthguard-theme-mode", theme);
    localStorage.setItem("wealthguard-color-theme", colorTheme);
    localStorage.setItem("wealthguard-font-size", fontSize);
    localStorage.setItem("wealthguard-language", language);

    // Apply classes to root HTML element
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    
    // Apply color theme
    document.documentElement.setAttribute("data-color-theme", colorTheme);
    
    // Apply global CSS variables
    if (theme === "dark") {
      document.documentElement.style.setProperty("--bg-main", "#121212");
      document.documentElement.style.setProperty("--text-main", "#ffffff");
    } else {
      // Light theme defaults
      document.documentElement.style.setProperty("--bg-main", "#ffffff");
      document.documentElement.style.setProperty("--text-main", "#1f2937");
    }

    // Apply color theme variables
    if (colorTheme === "blue") {
      document.documentElement.style.setProperty("--primary-color", "#3b82f6");
      document.documentElement.style.setProperty("--primary-hover", "#2563eb");
      document.documentElement.style.setProperty("--bg-accent", "#eff6ff");
    } else {
      // Purple theme defaults
      document.documentElement.style.setProperty("--primary-color", "#8b5cf6");
      document.documentElement.style.setProperty("--primary-hover", "#7c3aed");
      document.documentElement.style.setProperty("--bg-accent", "#f5f3ff");
    }

    // Apply font size
    document.documentElement.style.setProperty("--font-size-base", fontSizes[fontSize]);
    
    console.log(`Theme updated: ${theme}, Color: ${colorTheme}, Font: ${fontSize}, Language: ${language}`);
  }, [theme, colorTheme, fontSize, language, fontSizes]);

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        setTheme,
        colorTheme,
        setColorTheme,
        fontSize,
        setFontSize,
        language,
        setLanguage,
        fontSizes,
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

// Custom hook for easier usage
export const useThemeLanguage = () => useContext(ThemeLanguageContext);