import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';

import { LanguageProvider } from './pages/language';
import { ThemeProvider } from './pages/theme';
import { NotificationProvider } from './pages/notification';

const rootEl = document.getElementById('root');
rootEl.classList.add("theme-light-blue", "font-medium"); 

const root = ReactDOM.createRoot(rootEl);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>
);
reportWebVitals();
