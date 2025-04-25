import React, { useState, useContext, useRef, useEffect } from 'react';
import { FaHome, FaChevronDown, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, 
  FaSignOutAlt, FaSearch, FaBell, FaUser, FaLock, FaBrush, FaBell as FaBellIcon, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../pages/language';
import { useTheme } from '../pages/theme';
import { useNotifications } from '../pages/notification';
import { SettingsContext } from "../SettingsContext";


const Toggle = ({ checked, onChange }) => {
  return (
    <div className="relative inline-block w-12 align-middle select-none" onClick={onChange}>
      <input 
        type="checkbox" 
        checked={checked}
        className="sr-only"
      />
    <div className="relative inline-block w-12 h-6">
  <div className="block w-12 h-6 rounded-full bg-gray-400"></div>
  <div className={`dot absolute top-1 bg-gray-100 w-4 h-4 rounded-full transition transform ${checked ? 'translate-x-6 left-1' : 'left-1'}`}></div>
</div>
</div>
  );
};

const WealthGuardSettings = () => {
  const { settings, setSettings } = useContext(SettingsContext);

  const handleFontSize = (e) => {
    const val = e.target.value + "px";
    localStorage.setItem("fontSize", val);
    setSettings(prev => ({ ...prev, fontSize: val }));
  };

  const handleThemeColor = (e) => {
    const val = e.target.value;
    localStorage.setItem("themeColor", val);
    setSettings(prev => ({ ...prev, themeColor: val }));
  };

  const handleLanguage = (e) => {
    const val = e.target.value;
    localStorage.setItem("language", val);
    setSettings(prev => ({ ...prev, language: val }));
  };

  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Settings");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [username, setUsername] = useState("examp name");
  const [nickname, setNickname] = useState("examp nickname");
  const [email, setEmail] = useState("example@email.com");
  const [activeTab, setActiveTab] = useState("profile");
  const [textSize, setTextSize] = useState(2); // Default medium size
  
  // Get contexts
  const { language, changeLanguage, t } = useLanguage();
  const { theme, changeTheme, colorScheme, changeColorScheme } = useTheme();
  
  // Handle notification settings locally if context has issues
  const [localNotificationSettings, setLocalNotificationSettings] = useState({
    email: true,
    push: true,
    transactions: true,
    marketing: false,
    security: true
  });
  
  // Try to use context notifications, fallback to local if needed
  const { notificationSettings = localNotificationSettings, updateNotification } = useNotifications() || {};
  
  const searchInputRef = useRef(null);

  // Theme modes
  const themeModes = [
    { id: "light", name: "Light", icon: <FaSun className="mr-2" /> },
    { id: "dark", name: "Dark", icon: <FaMoon className="mr-2" /> }
  ];

  // Color schemes
  const colorSchemes = [
    { id: "blue", name: "Blue", icon: <FaBrush className="mr-2" /> },
    { id: "purple", name: "Purple", icon: <FaBrush className="mr-2" /> }
  ];

  // Available languages
  const languages = ["English", "Turkish"];

  // Function to handle text size change
  const handleTextSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setTextSize(size);
    
    // Remove existing text size classes
    document.documentElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
    
    // Add new text size class
    const sizeClass = size === 1 ? 'text-size-small' : size === 2 ? 'text-size-medium' : 'text-size-large';
    document.documentElement.classList.add(sizeClass);
    
    // Save to localStorage
    localStorage.setItem('wealthguard-textSize', size);
    console.log('Text size changed to:', size);
  };

  // Load saved text size in useEffect
  useEffect(() => {
    const savedTextSize = localStorage.getItem('wealthguard-textSize');
    if (savedTextSize) {
      const parsedSize = parseInt(savedTextSize);
      setTextSize(parsedSize);
      
      // Apply text size class
      const sizeClass = parsedSize === 1 ? 'text-size-small' : parsedSize === 2 ? 'text-size-medium' : 'text-size-large';
      document.documentElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
      document.documentElement.classList.add(sizeClass);
    }
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      // Load user saved settings from localStorage if available
      const savedTheme = localStorage.getItem('wealthguard-theme') || theme;
      const savedColorScheme = localStorage.getItem('wealthguard-colorScheme') || colorScheme;
      
      if (savedTheme !== theme) {
        changeTheme(savedTheme);
      }
      
      if (savedColorScheme !== colorScheme) {
        changeColorScheme(savedColorScheme);
      }
      
      // Apply in a single operation to avoid flickering
      document.documentElement.className = document.documentElement.className
        .replace(/theme-\w+/g, '')
        .replace(/color-\w+/g, '')
        .trim() + ` theme-${theme} color-${colorScheme}`;
      
      // Apply theme colors
      applyThemeColors();
      
      console.log(`Theme applied: ${theme}, Color scheme: ${colorScheme}`);
    };
    
    // Debounce theme changes to prevent flickering
    const timeoutId = setTimeout(applyTheme, 10);
    return () => clearTimeout(timeoutId);
  }, [theme, colorScheme]);
  
  // Function to apply theme colors based on current theme and color scheme
  const applyThemeColors = () => {
    // Theme color configurations
    const themeColors = {
      light: {
        blue: {
          accent: '#3B82F6', // blue
          accentLight: '#EFF6FF',
          bg: '#F9FAFB',
          card: '#FFFFFF',
          sidebar: '#FFFFFF',
          text: '#1F2937',
          textSecondary: '#6B7280',
          border: '#E5E7EB'
        },
        purple: {
          accent: '#8B5CF6', // purple
          accentLight: '#EDE9FE',
          bg: '#F9FAFB',
          card: '#FFFFFF',
          sidebar: '#FFFFFF',
          text: '#1F2937',
          textSecondary: '#6B7280',
          border: '#E5E7EB'
        }
      },
      dark: {
        blue: {
          accent: '#60A5FA', // blue
          accentLight: '#1E3A8A',
          bg: '#111827',
          card: '#1F2937',
          sidebar: '#0F172A',
          text: '#F9FAFB',
          textSecondary: '#D1D5DB',
          border: '#374151'
        },
        purple: {
          accent: '#A78BFA', // purple
          accentLight: '#4C1D95',
          bg: '#111827',
          card: '#1F2937',
          sidebar: '#0F172A',
          text: '#F9FAFB',
          textSecondary: '#D1D5DB',
          border: '#374151'
        }
      }
    };
    
    // Apply current theme colors to CSS variables
    const root = document.documentElement;
    const currentTheme = themeColors[theme][colorScheme];
    
    root.style.setProperty('--theme-accent', currentTheme.accent);
    root.style.setProperty('--theme-accent-light', currentTheme.accentLight);
    root.style.setProperty('--theme-bg', currentTheme.bg);
    root.style.setProperty('--theme-card', currentTheme.card);
    root.style.setProperty('--theme-sidebar', currentTheme.sidebar);
    root.style.setProperty('--theme-text', currentTheme.text);
    root.style.setProperty('--theme-text-secondary', currentTheme.textSecondary);
    root.style.setProperty('--theme-border', currentTheme.border);
    
    // Add global style for theme classes and transitions
    if (!document.getElementById('theme-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'theme-styles';
      styleEl.innerHTML = `
        /* Add transitions to prevent flickering */
        body, 
        .bg-theme-bg,
        .bg-card,
        .bg-sidebar,
        .text-theme,
        .text-theme-secondary,
        .border-theme {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        
        .theme-accent-light { background-color: var(--theme-accent-light); }
        .accent-bg { background-color: var(--theme-accent); }
        .bg-theme-bg { background-color: var(--theme-bg); }
        .bg-card { background-color: var(--theme-card); }
        .bg-sidebar { background-color: var(--theme-sidebar); }
        .text-theme-accent { color: var(--theme-accent); }
        .text-theme { color: var(--theme-text); }
        .text-theme-secondary { color: var(--theme-text-secondary); }
        .border-theme-accent { border-color: var(--theme-accent); }
        .border-theme { border-color: var(--theme-border); }
        
        /* Text size classes */
        .text-size-small {
          font-size: 0.85rem;
        }
        .text-size-medium {
          font-size: 1rem;
        }
        .text-size-large {
          font-size: 1.15rem;
        }
      `;
      document.head.appendChild(styleEl);
    }
  };
  
  // Save theme preferences to localStorage
  useEffect(() => {
    localStorage.setItem('wealthguard-theme', theme);
    localStorage.setItem('wealthguard-colorScheme', colorScheme);
  }, [theme, colorScheme]);
  
  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('wealthguard-language', language);
  }, [language]);
  
  // Load user profile from localStorage
  useEffect(() => {
    const savedUserProfile = localStorage.getItem('wealthguard-user');
    if (savedUserProfile) {
      const profile = JSON.parse(savedUserProfile);
      setUsername(profile.username || username);
      setNickname(profile.nickname || nickname);
      setEmail(profile.email || email);
    }
  }, []);
  
  // Load notification settings from localStorage
  useEffect(() => {
    const savedNotificationSettings = localStorage.getItem('wealthguard-notifications');
    if (savedNotificationSettings) {
      try {
        const parsedSettings = JSON.parse(savedNotificationSettings);
        setLocalNotificationSettings(parsedSettings);
        
        // If context's updateNotification exists, update the context too
        if (typeof updateNotification === 'function') {
          Object.keys(parsedSettings).forEach(key => {
            updateNotification(key, parsedSettings[key]);
          });
        }
      } catch (error) {
        console.error('Error parsing notification settings:', error);
      }
    }
  }, []);

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
    console.log(`Changing theme from ${theme} to ${newTheme}`);
    changeTheme(newTheme);
  };
  
  const handleColorSchemeChange = (newColorScheme) => {
    console.log(`Changing color scheme from ${colorScheme} to ${newColorScheme}`);
    changeColorScheme(newColorScheme);
  };

  const handleNotificationChange = (type) => {
    // Use context if available, otherwise update local state
    if (typeof updateNotification === 'function') {
      updateNotification(type, !notificationSettings[type]);
    } else {
      setLocalNotificationSettings(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
    }
    
    // Always update localStorage for persistence
    const currentSettings = typeof updateNotification === 'function' ? 
      notificationSettings : localNotificationSettings;
      
    const updatedSettings = {
      ...currentSettings,
      [type]: !currentSettings[type]
    };
    
    localStorage.setItem('wealthguard-notifications', JSON.stringify(updatedSettings));
    console.log(`Notification setting updated: ${type} - ${!currentSettings[type]}`);
  };

  const handleLogout = () => {
    // Clear any stored user session data
    localStorage.removeItem('wealthguard-user');
    navigate('/');
  };

  const handleSaveProfile = () => {
    // Save user profile data to localStorage
    const userProfile = { username, nickname, email };
    localStorage.setItem('wealthguard-user', JSON.stringify(userProfile));
    console.log("Saving profile...");
    alert("Profile information saved successfully!");
  };

  const handleResetPassword = () => {
    console.log("Reset password...");
    alert("Password reset email sent!");
  };

  const handleChangeLanguage = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
    console.log(`Language changed to: ${newLanguage}`);
  };

  // Determine which notification settings to use
  const effectiveNotificationSettings = typeof updateNotification === 'function' ? 
    notificationSettings : localNotificationSettings;

  return (
    <div className="h-screen w-screen font-worksans flex flex-col justify-between bg-theme-bg">
      <div className="flex-1 flex justify-center items-center p-4 md:p-8">
        <div className="mx-auto h-[calc(100vh-100px)] flex bg-card rounded-3xl shadow-lg overflow-hidden w-full max-w-10xl">

          {/*sidebar*/}
          <div className="w-64 border-r border-theme flex flex-col justify-between bg-sidebar">
            <div>
              <div className="p-6 border-b border-theme">
                <div className="flex items-center mb-2">
                  <div className="mr-2">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 object-cover" />
                  </div>
                  <a href="maindashboard" className="text-2xl italic font-bold text-theme">WealthGuard</a>
                </div>
              </div>

              {/*navigation*/}
              <div className="p-6 border-b border-theme">
                <h3 className="text-xs uppercase text-theme-secondary mb-2">{t('main')}</h3>
                <a href="maindashboard"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Dashboard" ? 'theme-accent-light text-theme-accent' : 'text-theme hover:bg-theme-accent-light hover:bg-opacity-10'}`}
                  onClick={() => handleNavClick("Dashboard")}
                >
                  <FaHome className="mr-3" />
                  <span className="font-medium">{t('dashboard')}</span>
                </a>
                <a href="recurringTransactionPage"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Transactions" ? 'theme-accent-light text-theme-accent' : 'text-theme hover:bg-theme-accent-light hover:bg-opacity-10'}`}
                  onClick={() => handleNavClick("Transactions")}
                >
                  <FaClock className="mr-3" />
                  <span>{t('transactions')}</span>
                </a>
                <a href="payments"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Payments" ? 'theme-accent-light text-theme-accent' : 'text-theme hover:bg-theme-accent-light hover:bg-opacity-10'}`}
                  onClick={() => handleNavClick("Payments")}
                >
                  <FaCreditCard className="mr-3" />
                  <span>{t('payments')}</span>
                </a>
                <a href="exchange"
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "Exchange" ? 'theme-accent-light text-theme-accent' : 'text-theme hover:bg-theme-accent-light hover:bg-opacity-10'}`}
                  onClick={() => handleNavClick("Exchange")}
                >
                  <FaExchangeAlt className="mr-3" />
                  <span>{t('exchange')}</span>
                </a>
              </div>

              <div className="p-6">
                <h3 className="text-xs uppercase text-theme-secondary mb-4">{t('others')}</h3>
                <a href="settings"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Settings" ? 'theme-accent-light text-theme-accent' : 'text-theme hover:bg-theme-accent-light hover:bg-opacity-10'}`}
                  onClick={() => handleNavClick("Settings")}
                >
                  <FaCog className="mr-3" />
                  <span>{t('settings')}</span>
                </a>
                <a href="faq"
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "faq" ? 'theme-accent-light text-theme-accent' : 'text-theme hover:bg-theme-accent-light hover:bg-opacity-10'}`}
                  onClick={() => handleNavClick("faq")}
                >
                  <FaQuestionCircle className="mr-3" />
                  <span>{t('support')}</span>
                </a>
              </div>
            </div>

            {/*logout*/}
            <div className="p-6 border-t border-theme mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 text-theme-accent hover:bg-red-50 rounded-lg"
              >
                <FaSignOutAlt className="mr-3" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>

          {/* main*/}
          <div className="flex-1 p-6 overflow-y-auto bg-theme-bg">
            {/* header*/}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div>
                  <h2 className="font-medium text-theme">{username}</h2>
                  <span className="text-sm text-theme-secondary">{nickname}</span>
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
                      className="bg-card border border-theme rounded-md px-4 py-2 pr-10 text-sm text-theme"
                      placeholder={t('search')}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <FaSearch
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-secondary cursor-pointer"
                      onClick={handleSearch}
                    />
                  </div>
                ) : (
                  <button className="p-2 text-theme-secondary mr-2" onClick={handleSearch}>
                    <FaSearch />
                  </button>
                )}
                <button className="p-2 text-theme-secondary mr-4">
                  <FaBell />
                </button>
              </div>
            </div>

            {/* settings container */}
            <div className="p-6 bg-card border border-theme rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-bold text-theme mb-6">{t('settings')}</h2>
              
              {/* tabs */}
              <div className="flex border-b border-theme mb-6">
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-theme-accent border-b-2 border-theme-accent' : 'text-theme-secondary hover:text-theme'}`}
                  onClick={() => handleTabClick('profile')}
                >
                  <FaUser className="inline mr-2" /> {t('profile')}
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'security' ? 'text-theme-accent border-b-2 border-theme-accent' : 'text-theme-secondary hover:text-theme'}`}
                  onClick={() => handleTabClick('security')}
                >
                  <FaLock className="inline mr-2" /> {t('security')}
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'appearance' ? 'text-theme-accent border-b-2 border-theme-accent' : 'text-theme-secondary hover:text-theme'}`}
                  onClick={() => handleTabClick('appearance')}
                >
                  <FaBrush className="inline mr-2" /> {t('appearance')}
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'notifications' ? 'text-theme-accent border-b-2 border-theme-accent' : 'text-theme-secondary hover:text-theme'}`}
                  onClick={() => handleTabClick('notifications')}
                >
                  <FaBellIcon className="inline mr-2" /> {t('notifications')}
                </button>
              </div>

              {/* profile settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-theme mb-1">{t('fullName')}</label>
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-theme rounded-md bg-card text-theme"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme mb-1">{t('displayName')}</label>
                      <input 
                        type="text" 
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full p-2 border border-theme rounded-md bg-card text-theme"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme mb-1">{t('email')}</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-theme rounded-md bg-card text-theme"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme mb-1">{t('language')}</label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={handleChangeLanguage}
                        className="w-full p-2 border border-theme rounded-md appearance-none bg-card text-theme"
                      >
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-theme-secondary pointer-events-none" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button 
                      onClick={handleSaveProfile}
                      className="px-4 py-2 accent-bg text-white rounded-md hover:bg-opacity-90"
                    >
                      {t('saveChanges')}
                    </button>
                  </div>
                </div>
              )}

              {/* security settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-theme mb-4">{t('password')}</h3>
                    <button 
                      onClick={handleResetPassword}
                      className="px-4 py-2 accent-bg text-white rounded-md hover:bg-opacity-90"
                    >
                      {t('resetPassword')}
                    </button>
                  </div>
                </div>
              )}

              {/* appearance settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-theme mb-4">{t('theme')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {themeModes.map((themeMode) => (
                        <div 
                          key={themeMode.id}
                          onClick={() => handleThemeChange(themeMode.id)}
                          className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                            theme === themeMode.id ? 'border-theme-accent bg-theme-accent-light bg-opacity-20' : 'border-theme hover:bg-theme-accent-light hover:bg-opacity-10'
                          }`}
                        >
                          {themeMode.icon}
                          <span className="text-theme">{t(themeMode.name.toLowerCase())}</span>
                          {theme === themeMode.id && (
                            <span className="ml-auto w-4 h-4 bg-theme-accent rounded-full"></span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {colorSchemes.map((scheme) => (
                        <div 
                          key={scheme.id}
                          onClick={() => handleColorSchemeChange(scheme.id)}
                          className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                            colorScheme === scheme.id ? 'border-theme-accent bg-theme-accent-light bg-opacity-20' : 'border-theme hover:bg-theme-accent-light hover:bg-opacity-10'
                          }`}
                        >
                          {scheme.icon}
                          <span className="text-theme">{t(scheme.name.toLowerCase())}</span>
                          {colorScheme === scheme.id && (
                            <span className="ml-auto w-4 h-4 bg-theme-accent rounded-full"></span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-theme mb-4">{t('textSize')}</h3>
                    <div className="w-full flex items-center">
                      <span className="text-sm mr-3 text-theme">A</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        value={textSize}
                        onChange={handleTextSizeChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-lg ml-3 text-theme">A</span>
                    </div>
                  </div>
                </div>
              )}

              {/* notification settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-theme mb-4">{t('notificationPreferences')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-theme">{t('emailNotifications')}</p>
                          <p className="text-sm text-theme-secondary">{t('emailNotificationsDesc')}</p>
                        </div>
                        <Toggle 
                          checked={notificationSettings.email}
                          onChange={() => handleNotificationChange('email')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-theme">{t('pushNotifications')}</p>
                          <p className="text-sm text-theme-secondary">{t('pushNotificationsDesc')}</p>
                        </div>
                        <Toggle 
                          checked={notificationSettings.push}
                          onChange={() => handleNotificationChange('push')}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-theme mb-4">{t('notificationTypes')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-theme">{t('transactionAlerts')}</p>
                          <p className="text-sm text-theme-secondary">{t('transactionAlertsDesc')}</p>
                        </div>
                        <Toggle 
                          checked={notificationSettings.transactions}
                          onChange={() => handleNotificationChange('transactions')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-theme">{t('marketingComm')}</p>
                          <p className="text-sm text-theme-secondary">{t('marketingCommDesc')}</p>
                        </div>
                        <Toggle 
                          checked={notificationSettings.marketing}
                          onChange={() => handleNotificationChange('marketing')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-theme">{t('securityAlerts')}</p>
                          <p className="text-sm text-theme-secondary">{t('securityAlertsDesc')}</p>
                        </div>
                        <Toggle 
                          checked={notificationSettings.security}
                          onChange={() => handleNotificationChange('security')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center text-sm text-theme-secondary p-4">© 2025 WealthGuard. All rights reserved.</footer>
    </div>
  );
};

export default WealthGuardSettings;