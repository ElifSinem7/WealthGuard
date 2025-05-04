import React, { useState, useEffect } from 'react';
import { FaHome, FaChevronDown, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, 
  FaSignOutAlt, FaSearch, FaPlus } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import AddTransactionModal from './AddTransactionModal';
import { useThemeLanguage } from './ThemeLanguageContext'; // Tema context'i import edildi

const WealthGuardTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activePage, setActivePage] = useState("Transactions");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [filterPeriod, setFilterPeriod] = useState("All Time");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const searchInputRef = React.useRef(null);

  // mock user data
  const [username] = useState("examp name");
  const [nickname] = useState("examp nickname");
  
  // Tema context'inden tüm tema bilgilerini al
  const { theme, colorTheme } = useThemeLanguage();

  useEffect(() => {
    const mockTransactions = [
      { id: 1, name: 'Netflix Subscription', category: 'Entertainment', amount: -24.85, date: '2025-04-05', type: 'expense', icon: 'video' },
      { id: 3, name: 'Grocery Shopping', category: 'Food', amount: -84.14, date: '2025-04-04', type: 'expense', icon: 'shopping' },
      { id: 4, name: 'Spotify', category: 'Entertainment', amount: -8.14, date: '2025-04-03', type: 'expense', icon: 'music' },
      { id: 5, name: 'Salary', category: 'Income', amount: 3500.00, date: '2025-04-01', type: 'income', icon: 'income' },
      { id: 7, name: 'Amazon Purchase', category: 'Shopping', amount: -67.99, date: '2025-03-23', type: 'expense', icon: 'shopping' },
      { id: 8, name: 'Freelance Work', category: 'Income', amount: 450.00, date: '2025-03-20', type: 'income', icon: 'income' },
      { id: 9, name: 'Restaurant', category: 'Food', amount: -45.80, date: '2025-03-18', type: 'expense', icon: 'food' },
      { id: 10, name: 'Gas Station', category: 'Transport', amount: -35.50, date: '2025-03-15', type: 'expense', icon: 'transport' },
      { id: 11, name: 'Interest', category: 'Income', amount: 12.34, date: '2025-03-12', type: 'income', icon: 'income' },
    ];
    
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  // Tema için dinamik sınıf belirleme
  const getThemeClass = (purpleClass, blueClass) => {
    return colorTheme === 'blue' ? blueClass : purpleClass;
  };

  // Dinamik sınıf atamaları
  const bgMainClass = theme === "dark" ? "bg-gray-900" : "bg-purple-50";
  const bgCardClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textMainClass = theme === "dark" ? "text-white" : "text-gray-800";
  const textSecondaryClass = theme === "dark" ? "text-gray-300" : "text-gray-500";
  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-100";
  const inputBgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const inputBorderClass = theme === "dark" ? "border-gray-600" : "border-gray-200";
  const hoverBgClass = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  const applyFilters = (txns, type, period, query) => {
    let filtered = [...txns];
    
    if (type !== "All") {
      filtered = filtered.filter(tx => tx.type === type.toLowerCase());
    }
    
    if (period !== "All Time") {
      const today = new Date();
      const periodStartDate = new Date();
      
      switch(period) {
        case "Today":
          periodStartDate.setHours(0, 0, 0, 0);
          break;
        case "This Week":
          periodStartDate.setDate(today.getDate() - today.getDay());
          break;
        case "Last Month":
          periodStartDate.setMonth(today.getMonth() - 1);
          break;
        case "Last 3 Months":
          periodStartDate.setMonth(today.getMonth() - 3);
          break;
        case "Last Year":
          periodStartDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(tx => new Date(tx.date) >= periodStartDate);
    }
    
    // filter by search
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.name.toLowerCase().includes(lowerQuery) || 
        tx.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    // sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "date") {
        comparison = new Date(b.date) - new Date(a.date);
      } else if (sortBy === "amount") {
        comparison = Math.abs(b.amount) - Math.abs(a.amount);
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "category") {
        comparison = a.category.localeCompare(b.category);
      }
      
      return sortOrder === "asc" ? -comparison : comparison;
    });
    
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      applyFilters(transactions, filterType, filterPeriod, searchQuery);
    }
  }, [filterType, filterPeriod, searchQuery, sortBy, sortOrder, transactions]);

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    console.log(`Navigating to ${pageName}`);
    if (pageName !== "Transactions") {
      navigate(`/${pageName.toLowerCase()}`);
    }
  };

  const handleSearch = () => {
    if (showSearchInput) {
      console.log("Searching for:", searchQuery);
      applyFilters(transactions, filterType, filterPeriod, searchQuery);
      setShowSearchInput(false);
    } else {
      setShowSearchInput(true);
      setTimeout(() => {
        searchInputRef.current && searchInputRef.current.focus();
      }, 100);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleAddTransaction = () => {
    setIsAddModalOpen(true);
  };
  
  const handleSaveTransaction = (newTransaction) => {
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    applyFilters(updatedTransactions, filterType, filterPeriod, searchQuery);
  };

  const groupTransactionsByDate = () => {
    const grouped = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString();
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      
      grouped[date].push(transaction);
    });
    
    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate();
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netAmount = totalIncome - totalExpense;

  return (
    <div className={`h-screen w-screen font-worksans flex flex-col justify-between ${bgMainClass} p-8 overflow-hidden`}>
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

              {/*main*/}
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

            {/* logout */}
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

          {/* main content */}
          <div className={`flex-1 p-6 overflow-y-auto ${bgCardClass}`}>
            {/* header */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div>
                  <h2 className={`font-medium ${textMainClass}`}>{username}</h2>
                  <span className={`text-sm ${textSecondaryClass}`}>{nickname}</span>
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
                      className={`${inputBgClass} border ${inputBorderClass} rounded-md px-4 py-2 pr-10 text-sm ${textMainClass}`}
                      placeholder="Search transactions..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <FaSearch 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                      onClick={handleSearch}
                    />
                  </div>
                ) : (
                  <button className={`p-2 ${textSecondaryClass} mr-2`} onClick={handleSearch}>
                    <FaSearch />
                  </button>
                )}
              </div>
            </div>

            {/*transaction sum */}
            <div className={`p-3 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
              <div className="flex justify-between items-center mb-1">
                <h2 className={`text-2xl font-bold ${textMainClass}`}>Transaction</h2>
              
                <div className="grid grid-cols-3 gap-4 mb-1">
                  <div className={`p-4 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-purple-950 rounded-full mr-2"></div>
                      <span className={`text-xs ${textSecondaryClass}`}>Total Income</span>
                    </div>
                    <div className="text-1xl font-bold text-green-300">${totalIncome.toLocaleString()}</div>
                  </div>

                  <div className={`p-4 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span className={`text-xs ${textSecondaryClass}`}>Total Expense</span>
                    </div>
                    <div className="text-1xl font-bold text-red-300">${totalExpense.toLocaleString()}</div>
                  </div>

                  <div className={`p-4 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-purple-200 rounded-full mr-2"></div>
                      <span className={`text-xs ${textSecondaryClass}`}>Net Amount</span>
                    </div>
                    <div className={`text-1xl font-bold ${netAmount >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      ${Math.abs(netAmount).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*transaction filters*/}
            <div className={`${bgCardClass} border ${borderClass} rounded-lg shadow-sm p-4 mb-6`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <select
                      className={`${inputBgClass} border ${inputBorderClass} rounded-md px-4 py-2 pr-8 text-sm appearance-none ${textMainClass}`}
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option>All</option>
                      <option>Income</option>
                      <option>Expense</option>
                    </select>
                    <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <div className="relative">
                    <select
                      className={`${inputBgClass} border ${inputBorderClass} rounded-md px-4 py-2 pr-8 text-sm appearance-none ${textMainClass}`}
                      value={filterPeriod}
                      onChange={(e) => setFilterPeriod(e.target.value)}
                    >
                      <option>All Time</option>
                      <option>Today</option>
                      <option>This Week</option>
                      <option>Last Month</option>
                      <option>Last 3 Months</option>
                      <option>Last Year</option>
                    </select>
                    <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <div className="relative">
                    <select
                      className={`${inputBgClass} border ${inputBorderClass} rounded-md px-4 py-2 pr-8 text-sm appearance-none ${textMainClass}`}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date">Sort by Date</option>
                      <option value="amount">Sort by Amount</option>
                      <option value="name">Sort by Name</option>
                      <option value="category">Sort by Category</option>
                    </select>
                    <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <button 
                    onClick={toggleSortOrder}
                    className={`${inputBgClass} border ${inputBorderClass} rounded-md px-4 py-2 text-sm ${textMainClass}`}
                  >
                    {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                  </button>
                </div>
                
                <button
                  onClick={handleAddTransaction}
                  className={`flex items-center ${getThemeClass('bg-purple-500 hover:bg-purple-600', 'bg-blue-500 hover:bg-blue-600')} text-white px-4 py-2 rounded-md text-sm`}
                >
                  <FaPlus className="mr-2" />
                  Add Transaction
                </button>
              </div>
            </div>

            {/* list */}
            <div className={`${bgCardClass} border ${borderClass} rounded-lg shadow-sm overflow-hidden`}>
              {Object.keys(groupedTransactions).length > 0 ? (
                Object.keys(groupedTransactions).map((date, index) => (
                  <div key={index}>
                    <div className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} py-2 px-4 border-b ${borderClass}`}>
                      <h3 className={`font-medium ${textSecondaryClass}`}>{date}</h3>
                    </div>
                    
                    {groupedTransactions[date].map((transaction, tIndex) => (
                      <div 
                        key={tIndex} 
                        className={`flex items-center justify-between p-4 border-b ${borderClass} ${hoverBgClass}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {transaction.type === 'income' ? '+' : '-'}
                          </div>
                          <div>
                            <div className={`font-medium ${textMainClass}`}>{transaction.name}</div>
                            <div className={`text-sm ${textSecondaryClass}`}>{transaction.category}</div>
                          </div>
                        </div>
                        <div className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className={`py-8 text-center ${textSecondaryClass}`}>
                  No transactions found matching your filters.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className={`text-center text-sm ${textSecondaryClass} mt-8`}>© 2025 WealthGuard. All rights reserved.</footer>
    
      {/* Modal için de tema değişkenlerini kullanmayı unutmayın */}
      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveTransaction}
        theme={theme}
        colorTheme={colorTheme}
      />
    </div>
  );
};

export default WealthGuardTransactions;