import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

// Korumalı rota bileşeni - sadece giriş yapmış kullanıcılar erişebilir
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation(); // Şu anki konumu al
  
  // Kullanıcı bilgileri yüklenirken bekleme ekranı göster
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  // Kullanıcı oturum açmamışsa login sayfasına yönlendir
  // state özelliğiyle kullanıcının geldiği sayfayı da gönder
  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }
  
  // Kullanıcı oturum açmışsa içeriği göster
  return children;
};

export default ProtectedRoute;