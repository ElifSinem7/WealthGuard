// src/components/NotificationComponent.js

import React, { useEffect } from "react";
import { requestPermissionAndGetToken } from "../firebase";  // Firebase token alma fonksiyonu

const NotificationComponent = ({ userId }) => {
  // Kullanıcıdan bildirim izni almak ve token almak
  useEffect(() => {
    const getNotificationToken = async () => {
      const token = await requestPermissionAndGetToken(userId);
      if (token) {
        console.log("Token başarıyla alındı:", token);
      } else {
        console.warn("Token alınamadı");
      }
    };

    getNotificationToken();
  }, [userId]);  // userId'yi props olarak alıyoruz (veya bir şekilde kullanıcıya özgü değer)

  return (
    <div>
      <h1>Bildirim Sistemi</h1>
      <p>Bildirim izni alındı mı? Evetse token alınabilir!</p>
    </div>
  );
};

export default NotificationComponent;
