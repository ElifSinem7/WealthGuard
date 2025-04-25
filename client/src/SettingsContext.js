import { createContext, useEffect, useState } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    fontSize: localStorage.getItem("fontSize") || "16px",
    themeColor: localStorage.getItem("themeColor") || "#2196f3",
    language: localStorage.getItem("language") || "tr",
  });

  // DOM’a CSS variable olarak uygula
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', settings.fontSize);
    document.documentElement.style.setProperty('--theme-color', settings.themeColor);
    document.documentElement.setAttribute("lang", settings.language);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
