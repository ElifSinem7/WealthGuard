import React, { useState, useEffect } from 'react';
import { FaHome, FaChevronDown, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, FaSignOutAlt, FaSearch, FaBell, FaPlus, FaTrash, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import PaMod from '../pages/paymod'

const WealthGuardPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [activePage, setActivePage] = useState("Payments");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const searchInputRef = React.useRef(null);

  // mock user data
  const [username] = useState("examp name");
  const [nickname] = useState("examp nickname");
  
  // Get current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  useEffect(() => {
    const mockPayments = [
      { id: 1, name: 'Rent', category: 'Housing', amount: 1200.00, dueDate: 1, paid: false, icon: 'home' },
      { id: 2, name: 'Netflix Subscription', category: 'Entertainment', amount: 24.85, dueDate: 15, paid: true, icon: 'video' },
      { id: 3, name: 'Electricity Bill', category: 'Utility', amount: 85.32, dueDate: 20, paid: false, icon: 'utility' },
      { id: 4, name: 'Internet Service', category: 'Utility', amount: 79.99, dueDate: 10, paid: true, icon: 'wifi' },
      { id: 5, name: 'Phone Bill', category: 'Utility', amount: 65.00, dueDate: 12, paid: false, icon: 'phone' },
      { id: 6, name: 'Gym Membership', category: 'Health', amount: 45.00, dueDate: 5, paid: true, icon: 'health' },
      { id: 7, name: 'Car Insurance', category: 'Insurance', amount: 150.00, dueDate: 18, paid: false, icon: 'car' },
      { id: 8, name: 'Water Bill', category: 'Utility', amount: 42.50, dueDate: 25, paid: false, icon: 'utility' },
      { id: 9, name: 'Spotify Subscription', category: 'Entertainment', amount: 9.99, dueDate: 15, paid: true, icon: 'music' },
    ];
    
    setPayments(mockPayments);
    setFilteredPayments(mockPayments);
  }, []);

  const applyFilters = (paymentItems, category, query) => {
    let filtered = [...paymentItems];
    
    if (category !== "All") {
      filtered = filtered.filter(payment => payment.category === category);
    }
    
    // filter by search
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.name.toLowerCase().includes(lowerQuery) || 
        payment.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    // sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "dueDate") {
        comparison = a.dueDate - b.dueDate;
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "category") {
        comparison = a.category.localeCompare(b.category);
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    setFilteredPayments(filtered);
  };

  useEffect(() => {
    if (payments.length > 0) {
      applyFilters(payments, filterCategory, searchQuery);
    }
  }, [filterCategory, searchQuery, sortBy, sortOrder, payments]);

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    console.log(`Navigating to ${pageName}`);
  };

  const handleSearch = () => {
    if (showSearchInput) {
      console.log("Searching for:", searchQuery);
      applyFilters(payments, filterCategory, searchQuery);
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

  const handleAddPayment = () => {
    setIsAddModalOpen(true);
  };
  
  const handleSavePayment = (newPayment) => {
    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);
    applyFilters(updatedPayments, filterCategory, searchQuery);
  };

  const handleDeletePayment = (paymentId) => {
    const updatedPayments = payments.filter(payment => payment.id !== paymentId);
    setPayments(updatedPayments);
    applyFilters(updatedPayments, filterCategory, searchQuery);
  };

  const togglePaymentStatus = (paymentId) => {
    const updatedPayments = payments.map(payment => 
      payment.id === paymentId ? {...payment, paid: !payment.paid} : payment
    );
    setPayments(updatedPayments);
    applyFilters(updatedPayments, filterCategory, searchQuery);
  };

  //upcoming payments
  const getUpcomingPayments = () => {
    const today = new Date().getDate();
    return payments.filter(payment => {
      if (payment.paid) return false;
      
      let dueDay = payment.dueDate;
      let daysUntilDue = dueDay - today;
      
      if (daysUntilDue < 0) {
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        daysUntilDue = lastDayOfMonth - today + dueDay;
      }
      
      return daysUntilDue <= 7 && daysUntilDue >= 0;
    });
  };

  const upcomingPayments = getUpcomingPayments();
  const totalMonthlyPayment = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments.filter(p => p.paid).reduce((sum, payment) => sum + payment.amount, 0);
  const unpaidAmount = totalMonthlyPayment - paidAmount;

  const categories = ["All", ...new Set(payments.map(payment => payment.category))];

  return (
    <div className="h-screen w-screen font-worksans flex flex-col justify-between bg-purple-50 p-8 overflow-hidden">
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

              {/*main*/}
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
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "Support" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("Support")}
                >
                  <FaQuestionCircle className="mr-3" />
                  <span>Support</span>
                </a>
              </div>
            </div>

            {/* logout */}
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

          {/* main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* header */}
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
                      placeholder="Search payments..."
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

            {/* Payments header */}
            <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm mb-4">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-2xl font-bold text-gray-800">Monthly Payments</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-1">
                <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-purple-950 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500">Total Monthly</span>
                  </div>
                  <div className="text-1xl font-bold text-purple-600">${totalMonthlyPayment.toLocaleString()}</div>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500">Paid</span>
                  </div>
                  <div className="text-1xl font-bold text-green-600">${paidAmount.toLocaleString()}</div>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500">Remaining</span>
                  </div>
                  <div className="text-1xl font-bold text-red-500">${unpaidAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Upcoming payment alerts */}
            {upcomingPayments.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg shadow-sm mb-4">
                <div className="flex items-center mb-3">
                  <FaExclamationTriangle className="mr-2 text-yellow-500" />
                  <h3 className="font-bold text-gray-800">Upcoming Payments</h3>
                </div>
                <div className="space-y-2">
                  {upcomingPayments.map(payment => {
                    const dueDate = new Date(currentYear, currentMonth, payment.dueDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    const diffTime = dueDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-2 bg-white rounded-md">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                            <FaCalendarAlt className="text-yellow-600" />
                          </div>
                          <div>
                            <div className="font-medium">{payment.name}</div>
                            <div className="text-xs text-gray-500">
                              {diffDays === 0 ? 'Due today' : `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">${payment.amount.toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* payment filters */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <select
                      className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2 pr-8 text-sm appearance-none"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      {categories.map((category, index) => (
                        <option key={index}>{category}</option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <div className="relative">
                    <select
                      className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2 pr-8 text-sm appearance-none"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="dueDate">Sort by Due Date</option>
                      <option value="amount">Sort by Amount</option>
                      <option value="name">Sort by Name</option>
                      <option value="category">Sort by Category</option>
                    </select>
                    <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <button 
                    onClick={toggleSortOrder}
                    className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm"
                  >
                    {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                  </button>
                </div>
                  
                <button
                  onClick={handleAddPayment}
                  className="flex items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm" >
                  <FaPlus className="mr-2" />
                  Add Payment
                </button>
              </div>
            </div>

            {/* payments list */}
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 py-3 px-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-medium text-gray-700">Monthly Recurring Payments</h3>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
              
              {filteredPayments.length > 0 ? (
                <div>
                  {filteredPayments.map((payment, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 ${payment.paid ? 'bg-gray-50' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${payment.paid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {payment.paid ? '✓' : payment.dueDate}
                        </div>
                        <div>
                          <div className="font-medium">{payment.name}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="font-medium text-gray-800 mr-4">
                          ${payment.amount.toFixed(2)}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => togglePaymentStatus(payment.id)}
                            className={`px-3 py-1 rounded-md text-xs font-medium ${payment.paid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}
                          >
                            {payment.paid ? 'Paid' : 'Mark Paid'}
                          </button>
                          
                          <button 
                            onClick={() => handleDeletePayment(payment.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No payments found matching your filters.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center text-sm text-gray-500 mt-8">© 2025 WealthGuard. All rights reserved.</footer>
      <PaMod
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSavePayment}
        />
    </div>
  );
};

export default WealthGuardPayments;