import React, { useState, useEffect } from 'react';
import { FaHome, FaChevronDown, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, FaSignOutAlt, FaSearch, FaBell } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const WealthGuardExchange = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Exchange");
  
  const [username] = useState("examp name");
  const [nickname] = useState("examp nickname");
  
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [exchangeRate] = useState(0.92); // Example rate, will be replaced by API
  
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  ];
  
  // Calculate converted amount whenever inputs change
  useEffect(() => {
    if (amount && !isNaN(amount)) {
      const converted = parseFloat(amount) * exchangeRate;
      setConvertedAmount(converted.toFixed(2));
    }
  }, [amount, exchangeRate]);
  
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

  return (
    <div className="h-screen w-screen font-worksans flex flex-col justify-between bg-purple-50 p-8 overflow-hidden">
      <div className="flex-1 flex justify-center items-center">
        <div className="mx-auto h-[calc(100vh-100px)] flex bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-10xl">

          {/* sidebar*/}
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

          {/* Main*/}
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

              {/*api */}
              <div className="flex gap-6">
                <div className="w-3/4 p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Exchange Rates</h3>
                  </div>
                  {/* API BURAYA GELECEK*/}
                </div>
                
                {/*yan tablo*/}
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
                        1 {fromCurrency} = {exchangeRate} {toCurrency}
                      </span>
                    </div>
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