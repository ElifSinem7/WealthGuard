import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { NotificationProvider } from "./pages/notification";

const rootEl = document.getElementById("root");
rootEl.classList.add("theme-light-blue", "font-medium");

const root = ReactDOM.createRoot(rootEl);

root.render(
  <React.StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </React.StrictMode>
);

reportWebVitals();
