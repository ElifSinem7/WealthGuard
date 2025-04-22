import React, { useState, useEffect } from 'react';
import { FaHome, FaChevronDown, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, FaSignOutAlt, FaSearch, FaBell, FaSync } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; 

const WealthGuardExchange = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Exchange");
  
  const [username] = useState("examp name");
  const [nickname] = useState("examp nickname");
  
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [exchangeRates, setExchangeRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  ];
  
  // API'den döviz kurlarını çekmek için fonksiyon
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
    // Her 1 saatte bir otomatik olarak güncelle
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
  
  // İki para birimi arasındaki kuru hesapla
  const getExchangeRate = (from, to) => {
    if (from === to) return 1;
    
    if (from === baseCurrency) {
      return exchangeRates[to] || 0;
    } else if (to === baseCurrency) {
      return 1 / (exchangeRates[from] || 1);
    } else {
      // Cross rate hesaplaması
      const fromRate = exchangeRates[from] || 0;
      const toRate = exchangeRates[to] || 0;
      
      if (fromRate === 0) return 0;
      return toRate / fromRate;
    }
  };
  
  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    console.log(`Navigating to ${pageName}`);
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
  
  // Baz para birimini değiştirdiğimizde kurları yeniden yükle
  const handleBaseChange = (newBase) => {
    setBaseCurrency(newBase);
  };
  
  // Para birimlerinin sıralanmış listesini getir
  const getPopularCurrencies = () => {
    return currencies.slice(0, 5); // İlk 5 para birimi
  };

  return (
    <div className="h-screen w-screen font-worksans flex flex-col justify-between bg-purple-50 p-8 overflow-hidden">
      <div className="flex-1 flex justify-center items-center">
        <div className="mx-auto h-[calc(100vh-100px)] flex bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-10xl">

          {/* Sidebar*/}
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

              {/* main*/}
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

          {/* Main Content*/}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/*header*/}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div>
                    <h2 className="font-medium text-gray-800">{username}</h2>
                    <span className="text-sm text-gray-500">{nickname}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="p-2 text-gray-400 mr-2">
                    <FaSearch />
                  </button>
                  <button className="p-2 text-gray-400 mr-4">
                    <FaBell />
                  </button>
                </div>
              </div>

              {/* Exchange Rates Table*/}
              <div className="flex gap-6">
                <div className="w-3/4 p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Exchange Rates</h3>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <span className="text-sm text-gray-500 mr-2">Base Currency:</span>
                        <select 
                          className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1"
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
                        className="flex items-center bg-purple-100 text-purple-600 px-3 py-1 rounded-md hover:bg-purple-200"
                      >
                        <FaSync className="mr-2" />
                        Refresh
                      </button>
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-center">
                        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading exchange rates...</p>
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
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Popular Currencies</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getPopularCurrencies().map(currency => (
                            <div key={currency.code} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="text-2xl mr-2">{currency.flag}</span>
                                  <div>
                                    <p className="font-medium">{currency.code}</p>
                                    <p className="text-sm text-gray-500">{currency.name}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    {currency.code === baseCurrency ? 1 : exchangeRates[currency.code]?.toFixed(4) || "N/A"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    1 {baseCurrency} = {currency.code === baseCurrency ? 1 : exchangeRates[currency.code]?.toFixed(4) || "N/A"} {currency.code}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* All Currencies Table */}
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">All Currencies</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Currency
                              </th>
                              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Code
                              </th>
                              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rate (1 {baseCurrency})
                              </th>
                              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Inverse Rate (1 Currency to {baseCurrency})
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {currencies.map(currency => (
                              <tr key={currency.code} className="hover:bg-gray-50">
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className="text-lg mr-2">{currency.flag}</span>
                                    <span>{currency.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  {currency.code}
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  {currency.code === baseCurrency ? 1 : exchangeRates[currency.code]?.toFixed(4) || "N/A"}
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  {currency.code === baseCurrency ? 1 : (1 / exchangeRates[currency.code]).toFixed(4) || "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {lastUpdated && (
                        <div className="text-right mt-4 text-sm text-gray-500">
                          Last updated: {lastUpdated}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Currency Converter Panel*/}
                <div className="w-1/4 p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Currency Exchange</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <div className="relative">
                      <select
                        className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 appearance-none"
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                      >
                        {currencies.map((currency) => (
                          <option key={`from-${currency.code}`} value={currency.code}>
                            {currency.flag} {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {currencies.find(c => c.code === fromCurrency)?.symbol}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center my-4">
                    <button
                      onClick={handleSwapCurrencies}
                      className="p-3 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
                    >
                      <FaExchangeAlt />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <div className="relative">
                      <select
                        className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 appearance-none"
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                      >
                        {currencies.map((currency) => (
                          <option key={`to-${currency.code}`} value={currency.code}>
                            {currency.flag} {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Converted Amount</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={convertedAmount}
                          readOnly
                          className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3"
                          placeholder="Converted amount"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {currencies.find(c => c.code === toCurrency)?.symbol}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Exchange Rate</span>
                      <span className="text-sm font-medium">
                        1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency).toFixed(4)} {toCurrency}
                      </span>
                    </div>
                    {loading && (
                      <div className="text-center mt-2">
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin inline-block mr-1"></div>
                        <span className="text-xs text-gray-500">Updating...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center text-sm text-gray-500 mt-8">© 2025 WealthGuard. All rights reserved.</footer>
    </div>
  );
};

export default WealthGuardExchange;