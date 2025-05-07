import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { NotificationProvider } from "./pages/notification";
import './services/axios-interceptor';
import { ThemeLanguageProvider } from './pages/ThemeLanguageContext';
import { UserProvider } from './contexts/UserContext';
import { TranslationProvider } from './pages/TranslationContext';
import { BrowserRouter } from "react-router-dom";

const rootEl = document.getElementById("root");
rootEl.classList.add("theme-light-blue", "font-medium");

const root = ReactDOM.createRoot(rootEl);

root.render(
  
  <React.StrictMode>
    <BrowserRouter>
      <ThemeLanguageProvider>
        <TranslationProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </TranslationProvider>
      </ThemeLanguageProvider>
      </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
