import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate(); // navigate hook'unu doğru konumda tanımlayın
  
  const [user, setUser] = useState(() => {
    // LocalStorage'dan kullanıcı bilgilerini kontrol et
    const savedUser = localStorage.getItem('user_data');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Eksik error state'ini tanımlayın

  // Tek bir useEffect kullanarak kullanıcı verilerini yükleyin
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if user is logged in
        if (!AuthService.isSessionValid()) {
          setLoading(false);
          return;
        }

        // Fetch user details
        const userData = await AuthService.fetchUserDetails();
        setUser(userData);
        
        // Kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        setError(null); // Başarılı durumda hatayı temizle
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err.message);
        
        // If error is due to invalid token, logout
        if (err.response && err.response.status === 401) {
          AuthService.logout();
          localStorage.removeItem('user_data'); // Token geçersizse localStorage'ı da temizle
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Logout function
  const logout = () => {
    AuthService.logout();
    localStorage.removeItem('user_data'); // localStorage'dan veriyi sil
    setUser(null);
    navigate('/');
  };

  // Exposed context value
  const contextValue = {
    user,
    setUser,
    loading,
    error,
    logout
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);