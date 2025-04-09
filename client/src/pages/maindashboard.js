import React, { useState, useRef, useEffect } from 'react';
import { FaHome, FaChevronDown, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, FaCar, FaShoppingCart, FaMusic, FaVideo, FaSignOutAlt, FaSearch, FaBell, FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from "react-router-dom";

//mock data
const mockTransactions = [
  { id: 1, name: 'Netflix Subscription', category: 'Entertainment', amount: -24.85, date: '2025-04-05', type: 'expense', icon: 'video' },
  { id: 3, name: 'Grocery Shopping', category: 'Food', amount: -84.14, date: '2025-04-04', type: 'expense', icon: 'shopping' },
  { id: 4, name: 'Spotify', category: 'Entertainment', amount: -8.14, date: '2025-04-03', type: 'expense', icon: 'music' },
  { id: 5, name: 'Salary', category: 'Income', amount: 3500.00, date: '2025-04-01', type: 'income', icon: 'income' },
  { id: 6, name: 'Amazon Purchase', category: 'Shopping', amount: -67.99, date: '2025-03-23', type: 'expense', icon: 'shopping' },
  { id: 7, name: 'Freelance Work', category: 'Income', amount: 450.00, date: '2025-03-20', type: 'income', icon: 'income' },
  { id: 8, name: 'Restaurant', category: 'Food', amount: -45.80, date: '2025-03-18', type: 'expense', icon: 'food' },
  { id: 9, name: 'Gas Station', category: 'Transport', amount: -35.50, date: '2025-03-15', type: 'expense', icon: 'transport' },
  { id: 10, name: 'Interest', category: 'Income', amount: 12.34, date: '2025-03-12', type: 'income', icon: 'income' },
];

//components
const WealthGuardDashboard = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState(["First home", "New car", "Vacation"]);
  const [selectedGoal, setSelectedGoal] = useState(goals[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [newGoalAmount, setNewGoalAmount] = useState("");
  const searchInputRef = useRef(null);
  const [activePage, setActivePage] = useState("Dashboard");
  const [timeframe, setTimeframe] = useState('Month');
  const [spendingTimeframe, setSpendingTimeframe] = useState('Last Month');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showTargetInput, setShowTargetInput] = useState(false);
  const [newTargetAmount, setNewTargetAmount] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editGoalName, setEditGoalName] = useState("");
  const [editGoalTarget, setEditGoalTarget] = useState("");
  const [goalBeingEdited, setGoalBeingEdited] = useState("");

const handleAddGoal = () => {
  setIsAddingGoal(true);
};

const handleEditGoal = (goalName) => {
  setGoalBeingEdited(goalName);
  setEditGoalName(goalName);
  setEditGoalTarget(goalsProgress[goalName].target.toString());
  setIsEditingGoal(true);
};

// Function to handle save edited goal
const handleSaveEditedGoal = () => {
  if (editGoalName && editGoalName.trim() !== "" && 
      editGoalTarget && !isNaN(Number(editGoalTarget)) && Number(editGoalTarget) > 0) {
    
    const updatedGoals = [...goals];
    // If name changed, update the name in the goals array
    if (editGoalName !== goalBeingEdited) {
      const index = updatedGoals.indexOf(goalBeingEdited);
      if (index !== -1) {
        updatedGoals[index] = editGoalName;
      }
    }
    
    // Create updated goals progress object
    const updatedGoalsProgress = { ...goalsProgress };
    
    // If name changed, create new entry with updated name and remove old one
    if (editGoalName !== goalBeingEdited) {
      updatedGoalsProgress[editGoalName] = {
        current: goalsProgress[goalBeingEdited].current,
        target: Number(editGoalTarget)
      };
      delete updatedGoalsProgress[goalBeingEdited];
    } else {
      // If just target changed, update the target value
      updatedGoalsProgress[goalBeingEdited] = {
        ...updatedGoalsProgress[goalBeingEdited],
        target: Number(editGoalTarget)
      };
    }
    
    // Update state
    setGoals(updatedGoals);
    setGoalsProgress(updatedGoalsProgress);
    
    // If the selected goal was edited, update selectedGoal state
    if (selectedGoal === goalBeingEdited) {
      setSelectedGoal(editGoalName);
    }
    
    // Reset form
    setIsEditingGoal(false);
    setEditGoalName("");
    setEditGoalTarget("");
    setGoalBeingEdited("");
  }
};

// Function to cancel editing
const handleCancelEdit = () => {
  setIsEditingGoal(false);
  setEditGoalName("");
  setEditGoalTarget("");
  setGoalBeingEdited("");
};

const handleSubmitNewGoal = () => {
  if (newGoalName && newGoalName.trim() !== "" && newGoalTarget && !isNaN(Number(newGoalTarget)) && Number(newGoalTarget) > 0) {
    // Set the new goal with user-defined target
    setGoalsProgress({
      ...goalsProgress,
      [newGoalName]: { current: 0, target: Number(newGoalTarget) }
    });
    setGoals([...goals, newGoalName]);
    setSelectedGoal(newGoalName);
    setNewGoalName("");
    setNewGoalTarget("");
    setIsAddingGoal(false);
  }
};

  const [goalsProgress, setGoalsProgress] = useState({
    "First home": { current: 3190, target: 24000 },
    "New car": { current: 1200, target: 8000 },
    "Vacation": { current: 800, target: 3000 }
  });

  // Load recent transactions from the mock data
  useEffect(() => {
    // Sort transactions by date (newest first) and take the first 4
    const sorted = [...mockTransactions].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    setRecentTransactions(sorted.slice(0, 4));
  }, []);

  const chartDataByTimeframe = {
    Day: [
      { name: '12am', income: 500, expenses: 320, scheduled: 600 },
      { name: '4am', income: 200, expenses: 150, scheduled: 300 },
      { name: '8am', income: 1000, expenses: 800, scheduled: 1200 },
      { name: '12pm', income: 1500, expenses: 1200, scheduled: 1800 },
      { name: '4pm', income: 800, expenses: 700, scheduled: 850 },
      { name: '8pm', income: 1200, expenses: 900, scheduled: 1300 },
      { name: '11pm', income: 600, expenses: 500, scheduled: 700 },
    ],
    Week: [
      { name: 'Mon', income: 8000, expenses: 6500, scheduled: 12000 },
      { name: 'Tue', income: 7500, expenses: 6200, scheduled: 11000 },
      { name: 'Wed', income: 9000, expenses: 7200, scheduled: 13000 },
      { name: 'Thu', income: 8500, expenses: 7000, scheduled: 12500 },
      { name: 'Fri', income: 10000, expenses: 8000, scheduled: 14000 },
      { name: 'Sat', income: 11000, expenses: 6800, scheduled: 15000 },
      { name: 'Sun', income: 7000, expenses: 5800, scheduled: 10000 },
    ],
    Month: [
      { name: 'Jan', income: 13000, expenses: 8000, scheduled: 10000 },
      { name: 'Feb', income: 11000, expenses: 12000, scheduled: 15000 },
      { name: 'Mar', income: 18000, expenses: 8000, scheduled: 15000 },
      { name: 'Apr', income: 15000, expenses: 10000, scheduled: 10000 },
      { name: 'May', income: 15000, expenses: 11000, scheduled: 12000 },
      { name: 'Jun', income: 13000, expenses: 8000, scheduled: 10000 },
      { name: 'Jul', income: 12000, expenses: 8000, scheduled: 14000 },
      { name: 'Aug', income: 9000, expenses: 8000, scheduled: 9000 },
      { name: 'Sep', income: 8000, expenses: 11000, scheduled: 10000 },
      { name: 'Oct', income: 11000, expenses: 12000, scheduled: 15000 },
    ],
    Year: [
      { name: '2020', income: 120000, expenses: 90000, scheduled: 160000 },
      { name: '2021', income: 140000, expenses: 100000, scheduled: 180000 },
      { name: '2022', income: 130000, expenses: 95000, scheduled: 170000 },
      { name: '2023', income: 150000, expenses: 110000, scheduled: 190000 },
      { name: '2024', income: 160000, expenses: 120000, scheduled: 200000 },
    ]
  };

  const spendingDataByTimeframe = {
    'Last Day': [
      { name: 'Food', value: 50 },
      { name: 'Transport', value: 30 },
      { name: 'Bills', value: 20 },
      { name: 'Others', value: 40 }
    ],
    'Last Week': [
      { name: 'Food', value: 400 },
      { name: 'Entertainment', value: 300 },
      { name: 'Bills', value: 200 },
      { name: 'Others', value: 350 }
    ],
    'Last Month': [
      { name: 'Food', value: 2000 },
      { name: 'Entertainment', value: 1500 },
      { name: 'Bills', value: 1000 },
      { name: 'Others', value: 1558.94 }
    ],
    'Last Year': [
      { name: 'Food', value: 24000 },
      { name: 'Entertainment', value: 18000 },
      { name: 'Bills', value: 12000 },
      { name: 'Others', value: 20000 }
    ]
  };

  const calculateTotalSpending = (timeframe) => {
    return spendingDataByTimeframe[timeframe].reduce((total, item) => total + item.value, 0);
  };

  const [totalSpending, setTotalSpending] = useState(calculateTotalSpending(spendingTimeframe));

  const financialDataByTimeframe = {
    Day: {
      income: { amount: 5800.00, change: '+3%' },
      scheduled: { amount: 6700.00, change: '+5%' },
      expenses: { amount: 4600.00, change: '-1%' },
      savings: 75,
    },
    Week: {
      income: { amount: 12500.00, change: '+4%' },
      scheduled: { amount: 18000.00, change: '+6%' },
      expenses: { amount: 5890.00, change: '-1.5%' },
      savings: 180,
    },
    Month: {
      income: { amount: 65320.00, change: '+6%' },
      scheduled: { amount: 95200.00, change: '+8%' },
      expenses: { amount: 15290.00, change: '-2%' },
      savings: 700,
    },
    Year: {
      income: { amount: 720000.00, change: '+7%' },
      scheduled: { amount: 860000.00, change: '+9%' },
      expenses: { amount: 175000.00, change: '-3%' },
      savings: 8400,
    }
  };

  const [username] = useState("examp name");
  const [nickname] = useState("examp nickname");

  const COLORS = ['#8B5CF6', '#C084FC', '#DDD6FE', '#A78BFA'];

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    console.log(`Navigating to ${pageName}`);
  };


  const handleEditTarget = () => {
    setShowTargetInput(true);
  };

  const handleSubmitNewTarget = () => {
    if (newTargetAmount && !isNaN(Number(newTargetAmount)) && Number(newTargetAmount) > 0) {
      const amountNum = Number(newTargetAmount);
      setGoalsProgress({
        ...goalsProgress,
        [selectedGoal]: {
          ...goalsProgress[selectedGoal],
          target: amountNum
        }
      });
      setNewTargetAmount("");
      setShowTargetInput(false);
    }
  };

  const calculateTotalSavings = () => {
    return Object.values(goalsProgress).reduce((total, goal) => total + goal.current, 0);
  };

  const handleDeleteGoal = (goalToDelete) => {
    if (goals.length <= 1) {
      alert("You must have at least one savings goal.");
      return;
    }
    
    const updatedGoals = goals.filter(goal => goal !== goalToDelete);
    const updatedProgress = { ...goalsProgress };
    delete updatedProgress[goalToDelete];
    
    setGoals(updatedGoals);
    setGoalsProgress(updatedProgress);
    
    if (selectedGoal === goalToDelete) {
      setSelectedGoal(updatedGoals[0]);
    }
  };

  const handleAddMoney = () => {
    setShowGoalInput(true);
  };

  const handleSubmitAddMoney = () => {
    if (newGoalAmount && !isNaN(Number(newGoalAmount)) && Number(newGoalAmount) > 0) {
      const amountNum = Number(newGoalAmount);
      setGoalsProgress({
        ...goalsProgress,
        [selectedGoal]: {
          ...goalsProgress[selectedGoal],
          current: goalsProgress[selectedGoal].current + amountNum
        }
      });
      setNewGoalAmount("");
      setShowGoalInput(false);
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

  const handleLogout = () => {
    navigate('/');
  };

  const handleSpendingTimeframeChange = (e) => {
    const newTimeframe = e.target.value;
    setSpendingTimeframe(newTimeframe);
    setTotalSpending(calculateTotalSpending(newTimeframe));
  };

  const currentChartData = chartDataByTimeframe[timeframe];
  const currentSpendingData = spendingDataByTimeframe[spendingTimeframe];
  const currentFinancialData = financialDataByTimeframe[timeframe];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'video': return <FaVideo className="h-4 w-4" />;
      case 'home': return <FaHome className="h-4 w-4" />;
      case 'shopping': return <FaShoppingCart className="h-4 w-4" />;
      case 'music': return <FaMusic className="h-4 w-4" />;
      case 'income': return <FaPlus className="h-4 w-4" />;
      case 'food': return <FaShoppingCart className="h-4 w-4" />;
      case 'transport': return <FaCar className="h-4 w-4" />;
      default: return <FaCreditCard className="h-4 w-4" />;
    }
  };

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

              {/*mainn*/}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xs uppercase text-gray-400 mb-2">MAIN</h3>
                <a href ="maindashboard"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Dashboard" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("Dashboard")}
                >
                  <FaHome className="mr-3" />
                  <span className="font-medium">Dashboard</span>
                </a>
                <a href ="recurringTransactionPage"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Transactions" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("Transactions")}
                >
                  <FaClock className="mr-3" />
                  <span>Transactions</span>
                </a>
                <a href ="payments" 
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Payments" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("Payments")}
                >
                  <FaCreditCard className="mr-3" />
                  <span>Payments</span>
                </a>
                <a href ="exchange"
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "Exchange" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("Exchange")}
                >
                  <FaExchangeAlt className="mr-3" />
                  <span>Exchange</span>
                </a>
              </div>

              <div className="p-6">
                <h3 className="text-xs uppercase text-gray-400 mb-4">OTHERS</h3>
                <a a href ="settings"
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Settings" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("Settings")}
                >
                  <FaCog className="mr-3" />
                  <span>Settings</span>
                </a>
                <a href ="faq" 
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "faq" ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handleNavClick("faq")}
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

          {/* main */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* header */}
              <div className="flex justify-between items-center mb-2">
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

              {/*budget overview*/}
              <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm mb-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Budget Overview</h2>
                  <div className="relative">
                    <select
                      className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2 pr-8 text-sm appearance-none"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                    >
                      <option>Day</option>
                      <option>Week</option>
                      <option>Month</option>
                      <option>Year</option>
                    </select>
                    <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex mb-6">
                  <div className="flex space-x-3 mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-300 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Income</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-900 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Expenses</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-purple-300 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-500 uppercase">INCOME</span>
                      <span className="ml-2 text-xs text-green-500">{currentFinancialData.income.change}</span>
                    </div>
                    <div className="text-2xl font-bold">${currentFinancialData.income.amount.toLocaleString()}</div>
                  </div>

                  <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-purple-900 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-500 uppercase">EXPENSES</span>
                      <span className="ml-2 text-xs text-red-500">{currentFinancialData.expenses.change}</span>
                    </div>
                    <div className="text-2xl font-bold">${currentFinancialData.expenses.amount.toLocaleString()}</div>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Line type="monotone" dataKey="income" stroke="oklch(38.1% 0.176 304.987)" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="expenses" stroke="oklch(82.7% 0.119 306.383)" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* bottom 3 */}
              <div className="grid grid-cols-3 gap-6">
                {/*recent transaction */}
                <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">Recent Transactions</h3>
                  </div>

                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {transaction.icon === 'video' && <FaVideo className="h-4 w-4" />}
                            {transaction.icon === 'home' && <FaHome className="h-4 w-4" />}
                            {transaction.icon === 'shopping' && <FaShoppingCart className="h-4 w-4" />}
                            {transaction.icon === 'music' && <FaMusic className="h-4 w-4" />}
                            {transaction.icon === 'income' && <FaPlus className="h-4 w-4" />}
                            {transaction.icon === 'food' && <FaShoppingCart className="h-4 w-4" />}
                            {transaction.icon === 'transport' && <FaClock className="h-4 w-4" />}
                            {!transaction.icon && <FaCreditCard className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{transaction.name}</div>
                            <div className="text-xs text-gray-500">{transaction.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">{formatDate(transaction.date)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a href="recurringTransactionPage" className="w-full mt-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center">
                    See All Transactions
                  </a>
                </div>
                
                {/*spending summary*/}
                <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">Spending Summary</h3>
                    <div className="relative">
                      <select
                        className="bg-gray-50 border border-gray-200 rounded-md px-3 py-1 pr-8 text-sm appearance-none"
                        value={spendingTimeframe}
                        onChange={handleSpendingTimeframeChange}>
                        <option>Last Day</option>
                        <option>Last Week</option>
                        <option>Last Month</option>
                        <option>Last Year</option>
                      </select>
                      <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex justify-center items-center h-48">
                    <div className="relative flex items-center justify-center">
                      <ResponsiveContainer width={400} height={170}>
                        <PieChart>
                          <Pie
                            data={currentSpendingData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            fill="#8884d8"
                            paddingAngle={0}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {currentSpendingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${value}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-lg font-semibold">${totalSpending.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Total Spending</div>
                  </div>
                </div>

                {/* savings */}
                    <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-2 ">Track Goals</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {goals.map((goal, index) => (
                        <div key={index} className="flex items-center">
                          <button
                            onClick={() => setSelectedGoal(goal)}
                            className={`px-4 py-2 rounded-full text-sm ${
                              selectedGoal === goal ? 'bg-purple-500 text-white' : 'bg-gray-100'}`}>
                            {goal}
                          </button>
                          <div className="flex ml-1">
                            <button 
                              onClick={() => handleEditGoal(goal)}
                              className="text-blue-500 hover:text-blue-700 mr-1">
                              <FaCog size={12} />
                            </button>
                            <button 
                              onClick={() => handleDeleteGoal(goal)}
                              className="text-red-500 hover:text-red-700">
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleAddGoal}
                        className="px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold hover:bg-purple-200"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    {/* Edit goal form */}
                    {isEditingGoal && (
                      <div className="mb-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-700 mb-3">Edit Goal</h5>
                        <input
                          type="text"
                          value={editGoalName}
                          onChange={(e) => setEditGoalName(e.target.value)}
                          placeholder="Goal name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                        />
                        <input
                          type="number"
                          value={editGoalTarget}
                          onChange={(e) => setEditGoalTarget(e.target.value)}
                          placeholder="Target amount ($)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEditedGoal}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex-1"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* New goal form */}
                    {isAddingGoal && (
                      <div className="mb-4">
                        <input
                          type="text"
                          value={newGoalName}
                          onChange={(e) => setNewGoalName(e.target.value)}
                          placeholder="Enter goal name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                        />
                        <input
                          type="number"
                          value={newGoalTarget}
                          onChange={(e) => setNewGoalTarget(e.target.value)}
                          placeholder="Enter target amount ($)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSubmitNewGoal}
                            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex-1"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingGoal(false);
                              setNewGoalName("");
                              setNewGoalTarget("");
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Goal details and add money section */}
                    {selectedGoal && !isAddingGoal && !isEditingGoal && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{selectedGoal}</span>
                          <span>${goalsProgress[selectedGoal].current.toFixed(2)} / ${goalsProgress[selectedGoal].target.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, (goalsProgress[selectedGoal].current / goalsProgress[selectedGoal].target) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {`${Math.min(100, Math.round((goalsProgress[selectedGoal].current / goalsProgress[selectedGoal].target) * 100))}%`}
                        </div>
                        
                        {showGoalInput ? (
                          <div className="mt-3">
                            <input
                              type="number"
                              value={newGoalAmount}
                              onChange={(e) => setNewGoalAmount(e.target.value)}
                              placeholder="Enter amount"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                            />
                            <div className="flex gap-2">
                              <button 
                                onClick={handleSubmitAddMoney}
                                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex-1"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => setShowGoalInput(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex-1"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={handleAddMoney}
                            className="mt-3 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm flex items-center justify-center w-full"
                          >
                            <FaPlus className="mr-2" /> Add Money
                          </button>
                        )}
                      </div>
                    )}
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

export default WealthGuardDashboard;