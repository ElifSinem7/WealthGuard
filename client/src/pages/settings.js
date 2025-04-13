import React, { useState, useEffect } from 'react';
import { FaHome, FaChevronDown, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, 
  FaSignOutAlt, FaSearch, FaBell, FaUser, FaLock, FaBrush, FaBell as FaBellIcon, 
  FaGlobe, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const WealthGuardSettings = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Settings");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [username, setUsername] = useState("examp name");
  const [nickname, setNickname] = useState("examp nickname");
  const [email, setEmail] = useState("example@email.com");
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    transactions: true,
    marketing: false,
    security: true
  });
  
  const searchInputRef = React.useRef(null);

  // theme
  const themes = [
    { id: "light", name: "Light", icon: <FaSun className="mr-2" /> },
    { id: "dark", name: "Dark", icon: <FaMoon className="mr-2" /> },
    { id: "purple", name: "Purple", icon: <FaBrush className="mr-2" /> },
    { id: "blue", name: "Blue", icon: <FaBrush className="mr-2" /> }
  ];

  // language
  const languages = ["English", "Turkish"];

  // theme effect 
  useEffect(() => {
    console.log(`Theme changed to: ${theme}`);
    document.body.className = theme;
    
    if (theme === "dark") {
      document.documentElement.style.setProperty('--bg-main', '#1a1a1a');
      document.documentElement.style.setProperty('--text-main', '#ffffff');
    } else if (theme === "purple") {
      document.documentElement.style.setProperty('--bg-main', '#f5f3ff');
      document.documentElement.style.setProperty('--text-main', '#4c1d95');
    } else if (theme === "blue") {
      document.documentElement.style.setProperty('--bg-main', '#eff6ff');
      document.documentElement.style.setProperty('--text-main', '#1e40af');
    } else {
      document.documentElement.style.setProperty('--bg-main', '#ffffff');
      document.documentElement.style.setProperty('--text-main', '#1f2937');
    }
  }, [theme]);

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    console.log(`Navigating to ${pageName}`);
    if (pageName !== "Settings") {
      navigate(`/${pageName.toLowerCase()}`);
    }
  };

  const handleSearch = () => {
    if (showSearchInput) {
      console.log("Searching for:", searchQuery);
      alert(`Searching for: ${searchQuery}`);
      setShowSearchInput(false);
      setSearchQuery("");
    } else {
      setShowSearchInput(true);
      setTimeout(() => {
        searchInputRef.current && searchInputRef.current.focus();
      }, 100);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('wealthguard-theme', newTheme);
  };

  const handleNotificationChange = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type]
    });
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

  const handleChangeLanguage = (e) => {
    setLanguage(e.target.value);
    console.log(`Language changed to: ${e.target.value}`);
  };

  return (
    <div className="h-screen w-screen font-worksans flex flex-col justify-between bg-purple-50 p-8">
      <div className="flex-1 flex justify-center items-center">
        <div className="mx-auto h-[calc(100vh-100px)] flex bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-10xl">

          {/*sidebar*/}
          <div className="w-64 border-r border-gray-100 flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="mr-2">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 object-cover" />
                  </div>
                  <a href="maindashboard" className="text-2xl italic font-bold text-gray-900">WealthGuard</a>
                </div>
              </div>

              {/*cokyoruldum*/}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xs uppercase text-gray-400 mb-2">MAIN</h3>
                <a href="maindashboard"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Dashboard" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("Dashboard")}
                >
                  <FaHome className="mr-3" />
                  <span className="font-medium">Dashboard</span>
                </a>
                <a href="recurringTransactionPage"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Transactions" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("Transactions")}
                >
                  <FaClock className="mr-3" />
                  <span>Transactions</span>
                </a>
                <a href="payments"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Payments" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("Payments")}
                >
                  <FaCreditCard className="mr-3" />
                  <span>Payments</span>
                </a>
                <a href="exchange"
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "Exchange" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("Exchange")}
                >
                  <FaExchangeAlt className="mr-3" />
                  <span>Exchange</span>
                </a>
              </div>

              <div className="p-6">
                <h3 className="text-xs uppercase text-gray-400 mb-4">OTHERS</h3>
                <a href="settings"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Settings" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("Settings")}
                >
                  <FaCog className="mr-3" />
                  <span>Settings</span>
                </a>
                <a href="faq"
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "faq" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("faq")}
                >
                  <FaQuestionCircle className="mr-3" />
                  <span>Support</span>
                </a>
              </div>
            </div>

            {/*logout*/}
            <div className="p-6 border-t border-gray-100 mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 text-purple-600 hover:bg-red-50 rounded-lg"
              >
                <FaSignOutAlt className="mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* main*/}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* header*/}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div>
                  <h2 className="font-medium text-gray-800">{username}</h2>
                  <span className="text-sm text-gray-500">{nickname}</span>
                </div>
              </div>
              <div className="flex items-center">
                {showSearchInput ? (
                  <div className="relative mr-2">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2 pr-10 text-sm"
                      placeholder="Search..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <FaSearch
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                      onClick={handleSearch}
                    />
                  </div>
                ) : (
                  <button className="p-2 text-gray-400 mr-2" onClick={handleSearch}>
                    <FaSearch />
                  </button>
                )}
                <button className="p-2 text-gray-400 mr-4">
                  <FaBell />
                </button>
              </div>
            </div>

            {/* ayarlar*/}
            <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>
              
              {/* tabs ayarlar*/}
              <div className="flex border-b border-gray-200 mb-6">
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleTabClick('profile')}
                >
                  <FaUser className="inline mr-2" /> Profile
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'security' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleTabClick('security')}
                >
                  <FaLock className="inline mr-2" /> Security
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'appearance' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleTabClick('appearance')}
                >
                  <FaBrush className="inline mr-2" /> Appearance
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'notifications' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleTabClick('notifications')}
                >
                  <FaBellIcon className="inline mr-2" /> Notifications
                </button>
              </div>

              {/* profile settings*/}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                      <input 
                        type="text" 
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={handleChangeLanguage}
                        className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                      >
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button 
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/*securittyyyy */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Password</h3>
                    <button 
                      onClick={handleResetPassword}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              )}

              {/*apperance*/}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {themes.map((themeOption) => (
                        <div 
                          key={themeOption.id}
                          onClick={() => handleThemeChange(themeOption.id)}
                          className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                            theme === themeOption.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {themeOption.icon}
                          <span>{themeOption.name}</span>
                          {theme === themeOption.id && (
                            <span className="ml-auto w-4 h-4 bg-purple-500 rounded-full"></span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Text Size</h3>
                    <div className="w-full flex items-center">
                      <span className="text-sm mr-3">A</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        defaultValue="2"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-lg ml-3">A</span>
                    </div>
                  </div>
                  <div>
                </div>
                </div>
              )}

              {/*notification */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input 
                            type="checkbox" 
                            checked={notifications.email}
                            onChange={() => handleNotificationChange('email')}
                            className="sr-only"
                          />
                          <div className={`block w-12 h-6 rounded-full ${notifications.email ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${notifications.email ? 'translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-gray-500">Receive notifications on your device</p>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input 
                            type="checkbox" 
                            checked={notifications.push}
                            onChange={() => handleNotificationChange('push')}
                            className="sr-only"
                          />
                          <div className={`block w-12 h-6 rounded-full ${notifications.push ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${notifications.push ? 'translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Transaction Alerts</p>
                          <p className="text-sm text-gray-500">Get notified about new transactions</p>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input 
                            type="checkbox" 
                            checked={notifications.transactions}
                            onChange={() => handleNotificationChange('transactions')}
                            className="sr-only"
                          />
                          <div className={`block w-12 h-6 rounded-full ${notifications.transactions ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${notifications.transactions ? 'translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Communications</p>
                          <p className="text-sm text-gray-500">Receive updates about new features and offers</p>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none">
                          <input 
                            type="checkbox" 
                            checked={notifications.marketing}
                            onChange={() => handleNotificationChange('marketing')}
                            className="sr-only"
                          />
                          <div className={`block w-12 h-6 rounded-full ${notifications.marketing ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${notifications.marketing ? 'translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center text-sm text-gray-500 mt-8">© 2025 WealthGuard. All rights reserved.</footer>
    </div>
  );
};

export default WealthGuardSettings;