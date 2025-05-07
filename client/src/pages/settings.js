import React, { useState, useEffect } from 'react';
import { FaHome, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, 
  FaSignOutAlt, FaUser, FaBrush } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useThemeLanguage } from "./ThemeLanguageContext";
import { useUser } from "../contexts/UserContext";
import SettingService from "../services/setting.service";
import AuthService from '../services/auth.service';

const WealthGuardSettings = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Settings");
  const [activeTab, setActiveTab] = useState("profile");
  
  // Get user context
  const { user, setUser, logout } = useUser();
  
  // Get theme context
  const { 
    theme, 
    colorTheme, 
    setColorTheme, 
    fontSize, 
    setFontSize,
    setTheme  
  } = useThemeLanguage();
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    email: ""
  });
  
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.name || "",
        nickname: user.nickname || "",
        email: user.email || ""
      });
    }
  }, [user]);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await SettingService.getSettings();
        
        if (settings.theme) {
          setTheme(settings.theme);
        }
        
        if (settings.color_theme) {
          setColorTheme(settings.color_theme);
        }
        
        if (settings.font_size) {
          setFontSize(settings.font_size);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    fetchSettings();
  }, [setTheme, setColorTheme, setFontSize]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle color theme change
  const handleColorThemeChange = async (newColorTheme) => {
    try {
      // Update UI first
      setColorTheme(newColorTheme);
      
      // Save to backend
      await SettingService.updateSettings({ color_theme: newColorTheme });
    } catch (error) {
      console.error('Error updating color theme:', error);
    }
  };
  
  // Handle font size change
  const handleFontSizeChange = async (event) => {
    const sliderValue = event.target.value;
    const newFontSize = sliderValueToFontSize(sliderValue);
    
    try {
      // Update UI first
      setFontSize(newFontSize);
      
      // Save to backend
      await SettingService.updateSettings({ font_size: newFontSize });
    } catch (error) {
      console.error('Error updating font size:', error);
    }
  };

  // Theme options
  const themes = [
    { id: "purple", name: "Purple", icon: <FaBrush className="mr-2" /> },
    { id: "blue", name: "Blue", icon: <FaBrush className="mr-2" /> }
  ];

  // Convert slider value to font size name
  const sliderValueToFontSize = (value) => {
    if (value === "1") return "small";
    if (value === "2") return "medium";
    if (value === "3") return "large";
    return "medium";
  };
  
  // Convert font size name to slider value
  const fontSizeToSliderValue = (size) => {
    if (size === "small") return "1";
    if (size === "medium") return "2";
    if (size === "large") return "3";
    return "2";
  };

  // Get theme class based on selected color theme
  const getThemeClass = (purpleClass, blueClass) => {
    return colorTheme === 'blue' ? blueClass : purpleClass;
  };

  // Navigation click handler
  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    if (pageName !== "Settings") {
      navigate(`/${pageName.toLowerCase()}`);
    }
  };

  // Tab click handler
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Logout handler
  const handleLogout = () => {
    logout(); // Use the logout function from the user context
    navigate('/');
  };

// Handle reset password
const handleResetPassword = async () => {
  try {
    // E-posta adresi doğrulaması
    if (!formData.email || !formData.email.includes('@')) {
      alert("Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }
    
    await SettingService.resetPassword({ email: formData.email });
    alert("Şifre sıfırlama e-postası başarıyla gönderildi!");
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    
    // Token hatası kontrolü
    if (error.response && error.response.status === 401) {
      alert("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      logout(); // Context'ten gelen logout fonksiyonu
      navigate('/');
      return;
    }
    
    alert("Şifre sıfırlama e-postası gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
  }
};

const handleSaveProfile = async () => {
  try {
    // İsim boş olmamalı kontrolü
    if (!formData.username.trim()) {
      alert("İsim alanı boş olamaz.");
      return;
    }
    
    const updatedUser = await SettingService.updateProfile({
      name: formData.username,
      nickname: formData.nickname,
      email: formData.email
    });
    
    // Kullanıcı context'ini güncelle
    if (updatedUser) {
      setUser(updatedUser);
      alert("Profil bilgileri başarıyla kaydedildi!");
    }
  } catch (error) {
    console.error("Profil kaydetme hatası:", error);
    
    // Token hatası kontrolü
    if (error.response && error.response.status === 401) {
      alert("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      AuthService.logout(); // AuthService'den logout fonksiyonunu çağır
      navigate('/');
      return;
    }
    
    alert("Profil bilgileri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
  }
};

  // Dynamic classes based on theme
  const bgMainClass = theme === "dark" ? "bg-gray-900" : "bg-purple-50";
  const bgCardClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textMainClass = theme === "dark" ? "text-white" : "text-gray-800";
  const textSecondaryClass = theme === "dark" ? "text-gray-300" : "text-gray-500";
  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-100";
  const inputBgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const inputBorderClass = theme === "dark" ? "border-gray-600" : "border-gray-200";
  const hoverBgClass = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  return (
    <div className={`h-screen w-screen font-worksans flex flex-col justify-between ${bgMainClass} p-8`}>
      <div className="flex-1 flex justify-center items-center">
        <div className={`mx-auto h-[calc(100vh-100px)] flex ${bgCardClass} rounded-3xl shadow-lg overflow-hidden w-full max-w-10xl`}>

          {/* Sidebar */}
          <div className={`w-64 border-r ${borderClass} flex flex-col justify-between`}>
            <div>
              <div className={`p-6 border-b ${borderClass}`}>
                <div className="flex items-center mb-2">
                  <div className="mr-2">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 object-cover" />
                  </div>
                  <a href="maindashboard" className={`text-2xl italic font-bold ${textMainClass}`}>WealthGuard</a>
                </div>
              </div>

              {/* Main navigation */}
              <div className={`p-6 border-b ${borderClass}`}>
                <h3 className={`text-xs uppercase ${textSecondaryClass} mb-2`}>MAIN</h3>
                <a href="maindashboard"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Dashboard" ? getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600') : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Dashboard")}
                >
                  <FaHome className="mr-3" />
                  <span className="font-medium">Dashboard</span>
                </a>
                <a href="recurringtransactionpage"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Transactions" ? getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600') : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Transactions")}
                >
                  <FaClock className="mr-3" />
                  <span>Transactions</span>
                </a>
                <a href="payments"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Payments" ? getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600') : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Payments")}
                >
                  <FaCreditCard className="mr-3" />
                  <span>Payments</span>
                </a>
                <a href="exchange"
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "Exchange" ? getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600') : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Exchange")}
                >
                  <FaExchangeAlt className="mr-3" />
                  <span>Exchange</span>
                </a>
              </div>

              {/* Other navigation */}
              <div className="p-6">
                <h3 className={`text-xs uppercase ${textSecondaryClass} mb-4`}>OTHERS</h3>
                <a href="settings"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Settings" ? getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600') : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Settings")}
                >
                  <FaCog className="mr-3" />
                  <span>Settings</span>
                </a>
                <a href="faq"
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "faq" ? getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600') : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("faq")}
                >
                  <FaQuestionCircle className="mr-3" />
                  <span>Support</span>
                </a>
              </div>
            </div>

            {/* Logout button */}
            <div className={`p-6 border-t ${borderClass} mt-auto`}>
              <button
                onClick={handleLogout}
                className={`flex items-center w-full p-3 ${getThemeClass('text-purple-600', 'text-blue-600')} hover:bg-red-50 rounded-lg`}
              >
                <FaSignOutAlt className="mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div>
                  <h2 className={`font-medium ${textMainClass}`}>{user ? user.name : "Guest"}</h2>
                  <span className={`text-sm ${textSecondaryClass}`}>{user ? user.nickname : "User"}</span>
                </div>
              </div>
            </div>

            {/* Settings panel */}
            <div className={`p-6 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm mb-6`}>
              <h2 className={`text-xl font-bold ${textMainClass} mb-6`}>Settings</h2>
              
              {/* Tabs for settings */}
              <div className={`flex border-b ${borderClass} mb-6`}>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'profile' ? getThemeClass('text-purple-600 border-b-2 border-purple-600', 'text-blue-600 border-b-2 border-blue-600') : `${textSecondaryClass} hover:${textMainClass}`}`}
                  onClick={() => handleTabClick('profile')}
                >
                  <FaUser className="inline mr-2" /> Profile
                </button>             
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'appearance' ? getThemeClass('text-purple-600 border-b-2 border-purple-600', 'text-blue-600 border-b-2 border-blue-600') : `${textSecondaryClass} hover:${textMainClass}`}`}
                  onClick={() => handleTabClick('appearance')}
                >
                  <FaBrush className="inline mr-2" /> Appearance
                </button>             
              </div>

              {/* Profile settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium ${textMainClass} mb-1`}>Full Name</label>
                      <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${textMainClass} mb-1`}>Display Name</label>
                      <input 
                        type="text" 
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${textMainClass} mb-1`}>Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md`}
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button 
                      onClick={handleResetPassword}
                      className={`px-4 py-2 ${getThemeClass('bg-purple-400 hover:bg-purple-500', 'bg-blue-400 hover:bg-blue-500')} text-white rounded-md transition duration-300 mr-4`}
                    >
                      Reset Password
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      className={`px-4 py-2 ${getThemeClass('bg-purple-600 hover:bg-purple-700', 'bg-blue-600 hover:bg-blue-700')} text-white rounded-md transition duration-300`}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  {/* Color Theme Selection */}
                  <div>
                    <h3 className={`text-lg font-medium ${textMainClass} mb-4`}>Color Theme</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {themes.map((themeOption) => (
                        <div 
                          key={themeOption.id}
                          onClick={() => handleColorThemeChange(themeOption.id)}
                          className={`p-4 border rounded-lg cursor-pointer flex items-center transition duration-300 ${
                            colorTheme === themeOption.id 
                              ? getThemeClass('border-purple-500 bg-purple-50', 'border-blue-500 bg-blue-50') 
                              : `${borderClass} ${hoverBgClass}`
                          } ${theme === "dark" ? "text-white" : ""}`}
                        >
                          {themeOption.icon}
                          <span>{themeOption.name}</span>
                          {colorTheme === themeOption.id && (
                            <span className={`ml-auto w-4 h-4 ${getThemeClass('bg-purple-500', 'bg-blue-500')} rounded-full`}></span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Font Size Selection */}
                  <div>
                    <h3 className={`text-lg font-medium ${textMainClass} mb-4`}>Text Size</h3>
                    <div className={`w-full flex items-center ${theme === "dark" ? "text-white" : ""}`}>
                      <span className="text-sm mr-3">A</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        value={fontSizeToSliderValue(fontSize)}
                        onChange={handleFontSizeChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-lg ml-3">A</span>
                    </div>
                    <div className={`mt-2 text-sm ${textSecondaryClass}`}>
                      Current text size: {fontSize ? fontSize.charAt(0).toUpperCase() + fontSize.slice(1) : 'Medium'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className={`text-center text-sm ${textSecondaryClass} mt-8`}>© 2025 WealthGuard. All rights reserved.</footer>
    </div>
  );
};

export default WealthGuardSettings;