import React, { useState, useEffect } from 'react';
import { FaHome, FaChevronDown, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, 
  FaSignOutAlt, FaSync } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; 
import { useThemeLanguage } from "./ThemeLanguageContext";
import { useUser } from '../contexts/UserContext';

const WealthGuardExchange = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Exchange");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [exchangeRates, setExchangeRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
   const { user } = useUser() || {};
    const [userData, setUserData] = useState({
        username: "Guest User", 
        nickname: "Guest"});
  
    useEffect(() => {
      if (user) {
        setUserData({
          username: user.name || "Guest User",
          nickname: user.nickname || "Guest"
        });
      }
    }, [user]);

  // Get theme context
  const { theme, colorTheme, fontSize, } = useThemeLanguage();
  
  // Add the missing getThemeClass function
  const getThemeClass = (purpleClass, blueClass) => {
    return colorTheme === 'blue' ? blueClass : purpleClass;
  };
  
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "TR" },
  ];
  
  // Fetch exchange rates function
  const fetchExchangeRates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/deb93ca2fe448aa17952d05c/latest/${baseCurrency}`);
      
      if (response.data && response.data.conversion_rates) {
        setExchangeRates(response.data.conversion_rates);
        setLastUpdated(new Date().toLocaleString());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Failed to fetch exchange rates. Please try again later.");
      console.error("Exchange rate API error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExchangeRates();
    // Update automatically every hour
    const interval = setInterval(fetchExchangeRates, 3600000);
    
    return () => clearInterval(interval);
  }, [baseCurrency]);
  
  useEffect(() => {
    if (amount && !isNaN(amount) && exchangeRates[toCurrency]) {
      const rate = getExchangeRate(fromCurrency, toCurrency);
      const converted = parseFloat(amount) * rate;
      setConvertedAmount(converted.toFixed(2));
    } else {
      setConvertedAmount("");
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);
  
  // Calculate exchange rate between two currencies
  const getExchangeRate = (from, to) => {
    if (from === to) return 1;
    
    if (from === baseCurrency) {
      return exchangeRates[to] || 0;
    } else if (to === baseCurrency) {
      return 1 / (exchangeRates[from] || 1);
    } else {
      // Cross rate calculation
      const fromRate = exchangeRates[from] || 0;
      const toRate = exchangeRates[to] || 0;
      
      if (fromRate === 0) return 0;
      return toRate / fromRate;
    }
  };
  
  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    if (pageName !== "Exchange") {
      navigate(`/${pageName.toLowerCase()}`);
    }
  };
  
  const handleLogout = () => {
    navigate('/');
  };
  
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount("");
    setConvertedAmount("");
  };
  
  // Change base currency
  const handleBaseChange = (newBase) => {
    setBaseCurrency(newBase);
  };
  
  // Get top currencies
  const getPopularCurrencies = () => {
    return currencies.slice(0, 5); // First 5 currencies
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
  const fontSizeClass = fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";
  const headingFontClass = fontSize === "small" ? "text-lg" : fontSize === "large" ? "text-2xl" : "text-xl";

  return (
    <div className={`h-screen w-screen font-worksans flex flex-col justify-between ${bgMainClass} p-8 overflow-hidden ${fontSizeClass}`}>
      <div className="flex-1 flex justify-center items-center">
        <div className={`mx-auto h-[calc(100vh-100px)] flex ${bgCardClass} rounded-3xl shadow-lg overflow-hidden w-full max-w-10xl`}>

          {/* Sidebar*/}
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

              {/* main*/}
              <div className={`p-6 border-b ${borderClass}`}>
                <h3 className={`text-xs uppercase ${textSecondaryClass} mb-2`}>MAIN</h3>
                <a href="maindashboard"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Dashboard" ? getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600') : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Dashboard")}
                >
                  <FaHome className="mr-3" />
                  <span className="font-medium">Dashboard</span>
                </a>
                <a href="recurringTransactionPage"
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

          {/* Main Content*/}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/*header*/}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div>
                    <h2 className={`font-medium ${textMainClass}`}>{userData.username}</h2>
                    <span className={`text-sm ${textSecondaryClass}`}>{userData.nickname}</span>
                  </div>
                </div>
                <div className="flex items-center">
                </div>
              </div>

              {/* Exchange Rates Table*/}
              <div className="flex gap-6">
                <div className={`w-3/4 p-6 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`${headingFontClass} font-bold ${textMainClass}`}>Exchange Rates</h3>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <span className={`text-sm ${textSecondaryClass} mr-2`}>Base Currency:</span>
                        <select 
                          className={`${inputBgClass} border ${inputBorderClass} rounded-md px-2 py-1 ${textMainClass}`}
                          value={baseCurrency}
                          onChange={(e) => handleBaseChange(e.target.value)}
                        >
                          {currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>
                              {currency.flag} {currency.code}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={fetchExchangeRates}
                        className={`flex items-center ${getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600')} px-3 py-1 rounded-md ${getThemeClass('hover:bg-purple-200', 'hover:bg-blue-200')}`}
                      >
                        <FaSync className="mr-2" />
                        Refresh
                      </button>
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-center">
                        <div className={`w-10 h-10 border-4 ${getThemeClass('border-purple-500', 'border-blue-500')} border-t-transparent rounded-full animate-spin mx-auto mb-2`}></div>
                        <p className={textSecondaryClass}>Loading exchange rates...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                      {error}
                    </div>
                  ) : (
                    <div>
                      {/* Popular Currency Section */}
                      <div className="mb-8">
                        <h4 className={`${headingFontClass} font-semibold ${textMainClass} mb-4`}>Popular Currencies</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getPopularCurrencies().map(currency => (
                            <div key={currency.code} className={`${inputBgClass} p-4 rounded-lg`}>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="text-2xl mr-2">{currency.flag}</span>
                                  <div>
                                    <p className={`font-medium ${textMainClass}`}>{currency.code}</p>
                                    <p className={`text-sm ${textSecondaryClass}`}>{currency.name}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-medium ${textMainClass}`}>
                                    {currency.code === baseCurrency ? 1 : exchangeRates[currency.code]?.toFixed(4) || "N/A"}
                                  </p>
                                  <p className={`text-xs ${textSecondaryClass}`}>
                                    1 {baseCurrency} = {currency.code === baseCurrency ? 1 : exchangeRates[currency.code]?.toFixed(4) || "N/A"} {currency.code}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* All Currencies Table */}
                      <h4 className={`${headingFontClass} font-semibold ${textMainClass} mb-4`}>All Currencies</h4>
                      <div className="overflow-x-auto">
                        <table className={`min-w-full ${bgCardClass}`}>
                          <thead className={inputBgClass}>
                            <tr>
                              <th className={`py-3 px-4 text-left text-xs font-medium ${textSecondaryClass} uppercase tracking-wider`}>
                                Currency
                              </th>
                              <th className={`py-3 px-4 text-left text-xs font-medium ${textSecondaryClass} uppercase tracking-wider`}>
                                Code
                              </th>
                              <th className={`py-3 px-4 text-right text-xs font-medium ${textSecondaryClass} uppercase tracking-wider`}>
                                Rate (1 {baseCurrency})
                              </th>
                              <th className={`py-3 px-4 text-right text-xs font-medium ${textSecondaryClass} uppercase tracking-wider`}>
                                Inverse Rate (1 Currency to {baseCurrency})
                              </th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${borderClass}`}>
                            {currencies.map(currency => (
                              <tr key={currency.code} className={hoverBgClass}>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className="text-lg mr-2">{currency.flag}</span>
                                    <span className={textMainClass}>{currency.name}</span>
                                  </div>
                                </td>
                                <td className={`py-3 px-4 whitespace-nowrap ${textMainClass}`}>
                                  {currency.code}
                                </td>
                                <td className={`py-3 px-4 text-right whitespace-nowrap ${textMainClass}`}>
                                  {currency.code === baseCurrency ? 1 : exchangeRates[currency.code]?.toFixed(4) || "N/A"}
                                </td>
                                <td className={`py-3 px-4 text-right whitespace-nowrap ${textMainClass}`}>
                                  {currency.code === baseCurrency ? 1 : (1 / exchangeRates[currency.code]).toFixed(4) || "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {lastUpdated && (
                        <div className={`text-right mt-4 text-sm ${textSecondaryClass}`}>
                          Last updated: {lastUpdated}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Currency Converter Panel*/}
                <div className={`w-1/4 p-6 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
                  <h2 className={`${headingFontClass} font-bold ${textMainClass} mb-6`}>Currency Exchange</h2>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${textMainClass} mb-2`}>From</label>
                    <div className="relative">
                      <select
                        className={`w-full ${inputBgClass} border ${inputBorderClass} rounded-md px-4 py-3 appearance-none ${textMainClass}`}
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                      >
                        {currencies.map((currency) => (
                          <option key={`from-${currency.code}`} value={currency.code}>
                            {currency.flag} {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass} pointer-events-none`} />
                    </div>
                    
                    <div className="mt-4">
                      <label className={`block text-sm font-medium ${textMainClass} mb-2`}>Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className={`w-full ${inputBgClass} border ${inputBorderClass} rounded-md px-4 py-3 ${textMainClass}`}
                        />
                        <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`}>
                          {currencies.find(c => c.code === fromCurrency)?.symbol}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center my-4">
                    <button
                      onClick={handleSwapCurrencies}
                      className={`p-3 ${getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600')} rounded-full ${getThemeClass('hover:bg-purple-200', 'hover:bg-blue-200')}`}
                    >
                      <FaExchangeAlt />
                    </button>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${textMainClass} mb-2`}>To</label>
                    <div className="relative">
                      <select
                        className={`w-full ${inputBgClass} border ${inputBorderClass} rounded-md px-4 py-3 appearance-none ${textMainClass}`}
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                      >
                        {currencies.map((currency) => (
                          <option key={`to-${currency.code}`} value={currency.code}>
                            {currency.flag} {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass} pointer-events-none`} />
                    </div>
                    
                    <div className="mt-4">
                      <label className={`block text-sm font-medium ${textMainClass} mb-2`}>Converted Amount</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={convertedAmount}
                          readOnly
                          className={`w-full ${inputBgClass} border ${inputBorderClass} rounded-md px-4 py-3 ${textMainClass}`}
                          placeholder="Converted amount"
                        />
                        <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`}>
                          {currencies.find(c => c.code === toCurrency)?.symbol}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${inputBgClass} rounded-lg p-4 mt-4`}>
                    <div className="flex justify-between">
                      <span className={`text-sm ${textSecondaryClass}`}>Exchange Rate</span>
                      <span className={`text-sm font-medium ${textMainClass}`}>
                        1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency).toFixed(4)} {toCurrency}
                      </span>
                    </div>
                    {loading && (
                      <div className="text-center mt-2">
                        <div className={`w-4 h-4 border-2 ${getThemeClass('border-purple-500', 'border-blue-500')} border-t-transparent rounded-full animate-spin inline-block mr-1`}></div>
                        <span className={`text-xs ${textSecondaryClass}`}>Updating...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className={`text-center text-sm ${textSecondaryClass} mt-8`}>© 2025 WealthGuard. All rights reserved.</footer>
    </div>
  );
};

export default WealthGuardExchange;