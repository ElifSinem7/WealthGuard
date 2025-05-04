import React, { useState } from 'react';
import { FaHome, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, 
  FaSignOutAlt, FaUser, FaBrush} from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useThemeLanguage } from "./ThemeLanguageContext";

const WealthGuardSettings = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Settings");
  const [username, setUsername] = useState("examp name");
  const [nickname, setNickname] = useState("examp nickname");
  const [email, setEmail] = useState("example@email.com");
  const [activeTab, setActiveTab] = useState("profile");
  
  // Get theme context
  const { 
    theme, 
    colorTheme, 
    setColorTheme, 
    fontSize, 
    setFontSize,
  } = useThemeLanguage();

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
  };
  
  // Convert font size name to slider value
  const fontSizeToSliderValue = (size) => {
    if (size === "small") return "1";
    if (size === "medium") return "2";
    if (size === "large") return "3";
  };

  // Method to get the appropriate color class based on current theme
  const getThemeClass = (purpleClass, blueClass) => {
    return colorTheme === 'blue' ? blueClass : purpleClass;
  };

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    console.log(`Navigating to ${pageName}`);
    if (pageName !== "Settings") {
      navigate(`/${pageName.toLowerCase()}`);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleColorThemeChange = (newColorTheme) => {
    setColorTheme(newColorTheme);
  };
  
  const handleFontSizeChange = (event) => {
    const sliderValue = event.target.value;
    const newFontSize = sliderValueToFontSize(sliderValue);
    setFontSize(newFontSize);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSaveProfile = () => {
    console.log("Saving profile...");
    alert("Profile information saved successfully!");
  };

  const handleResetPassword = () => {
    console.log("Reset password...");
    alert("Password reset email sent!");
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

          {/*sidebar*/}
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

              {/*navigation menu*/}
              <div className={`p-6 border-b ${borderClass}`}>
                <h3 className={`text-xs uppercase ${textSecondaryClass} mb-2`}>MAIN</h3>
                <a href="maindashboard"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Dashboard" ? `${getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600')}` : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Dashboard")}
                >
                  <FaHome className="mr-3" />
                  <span className="font-medium">Dashboard</span>
                </a>
                <a href="recurringTransactionPage"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Transactions" ? `${getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600')}` : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Transactions")}
                >
                  <FaClock className="mr-3" />
                  <span>Transactions</span>
                </a>
                <a href="payments"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Payments" ? `${getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600')}` : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Payments")}
                >
                  <FaCreditCard className="mr-3" />
                  <span>Payments</span>
                </a>
                <a href="exchange"
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "Exchange" ? `${getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600')}` : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Exchange")}
                >
                  <FaExchangeAlt className="mr-3" />
                  <span>Exchange</span>
                </a>
              </div>

              <div className="p-6">
                <h3 className={`text-xs uppercase ${textSecondaryClass} mb-4`}>OTHERS</h3>
                <a href="settings"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Settings" ? `${getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600')}` : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Settings")}
                >
                  <FaCog className="mr-3" />
                  <span>Settings</span>
                </a>
                <a href="faq"
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "faq" ? `${getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600')}` : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("faq")}
                >
                  <FaQuestionCircle className="mr-3" />
                  <span>Support</span>
                </a>
              </div>
            </div>

            {/*logout*/}
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

          {/* main content*/}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* header*/}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div>
                  <h2 className={`font-medium ${textMainClass}`}>{username}</h2>
                  <span className={`text-sm ${textSecondaryClass}`}>{nickname}</span>
                </div>
              </div>
              <div className="flex items-center">
              </div>
            </div>

            {/* settings panel*/}
            <div className={`p-6 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm mb-6`}>
              <h2 className={`text-xl font-bold ${textMainClass} mb-6`}>Settings</h2>
              
              {/* tabs for settings*/}
              <div className={`flex border-b ${borderClass} mb-6`}>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'profile' ? `${getThemeClass('text-purple-600 border-b-2 border-purple-600', 'text-blue-600 border-b-2 border-blue-600')}` : `${textSecondaryClass} hover:${textMainClass}`}`}
                  onClick={() => handleTabClick('profile')}
                >
                  <FaUser className="inline mr-2" /> Profile
                </button>             
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'appearance' ? `${getThemeClass('text-purple-600 border-b-2 border-purple-600', 'text-blue-600 border-b-2 border-blue-600')}` : `${textSecondaryClass} hover:${textMainClass}`}`}
                  onClick={() => handleTabClick('appearance')}
                >
                  <FaBrush className="inline mr-2" /> Appearance
                </button>             
              </div>

              {/* profile settings*/}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium ${textMainClass} mb-1`}>Full Name</label>
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full p-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${textMainClass} mb-1`}>Display Name</label>
                      <input 
                        type="text" 
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className={`w-full p-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${textMainClass} mb-1`}>Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md`}
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                  <div>
                    <button 
                      onClick={handleResetPassword}
                      className={`px-4 py-2 ${getThemeClass('bg-purple-400 hover:bg-purple-700', 'bg-blue-400 hover:bg-blue-700')} text-white rounded-md transition duration-300`}
                    >
                      Reset Password
                    </button>
                  </div>
                </div>              
                  <div className="space-y-6">
                    <button 
                      onClick={handleSaveProfile}
                      className={`px-4 py-2 ${getThemeClass('bg-purple-600 hover:bg-purple-700', 'bg-blue-600 hover:bg-blue-700')} text-white rounded-md transition duration-300`}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* appearance settings */}
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
                      Current text size: {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
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