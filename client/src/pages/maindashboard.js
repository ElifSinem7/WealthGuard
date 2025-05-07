import React, { useState, useEffect } from 'react';
import { FaHome, FaChevronDown, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, FaSignOutAlt, FaBell, FaTrash, FaPlus,} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from "react-router-dom";
import NotificationModal from '../components/ui/NotificationModal';
import { useThemeLanguage } from "./ThemeLanguageContext";
import { useUser } from '../contexts/UserContext';
import TransactionService from "../services/transaction.service";
import AuthService from '../services/auth.service';
import GoalService from "../services/goal.service";
import { Link } from 'react-router-dom'; // Fixed import
import PaymentService from '../services/payment.service';

// Mock data
const mockTransactions = [
  { id: 1, name: 'Netflix Subscription', category: 'Entertainment', amount: -24.85, date: '2025-04-05', type: 'expense', icon: 'video' },
  { id: 3, name: 'Grocery Shopping', category: 'Food', amount: -84.14, date: '2025-04-20', type: 'expense', icon: 'shopping' },
  { id: 4, name: 'Spotify', category: 'Entertainment', amount: -8.14, date: '2025-04-19', type: 'expense', icon: 'music' },
  { id: 5, name: 'Salary', category: 'Income', amount: 3500.00, date: '2025-04-18', type: 'income', icon: 'income' },
  { id: 6, name: 'Amazon Purchase', category: 'Shopping', amount: -67.99, date: '2025-03-30', type: 'expense', icon: 'shopping' },
  { id: 7, name: 'Freelance Work', category: 'Income', amount: 450.00, date: '2025-03-20', type: 'income', icon: 'income' },
  { id: 8, name: 'Restaurant', category: 'Food', amount: -45.80, date: '2025-03-18', type: 'expense', icon: 'food' },
  { id: 9, name: 'Gas Station', category: 'Transport', amount: -35.50, date: '2025-03-15', type: 'expense', icon: 'transport' },
  { id: 10, name: 'Interest', category: 'Income', amount: 12.34, date: '2025-03-12', type: 'income', icon: 'income' },
  { id: 11, name: 'Coffee Shop', category: 'Food', amount: -4.50, date: '2025-04-01', type: 'expense', icon: 'food' },
  { id: 12, name: 'Part-time Work', category: 'Income', amount: 120.00, date: '2025-04-02', type: 'income', icon: 'income' },
  { id: 13, name: 'Bus Ticket', category: 'Transport', amount: -2.75, date: '2025-04-03', type: 'expense', icon: 'transport' },
  { id: 14, name: 'Book Purchase', category: 'Shopping', amount: -15.99, date: '2025-04-04', type: 'expense', icon: 'shopping' },
  { id: 15, name: 'Dividend', category: 'Income', amount: 25.40, date: '2025-04-06', type: 'income', icon: 'income' },
  { id: 16, name: 'Phone Bill', category: 'Utilities', amount: -45.00, date: '2025-04-07', type: 'expense', icon: 'home' },
  { id: 17, name: 'Consulting Fee', category: 'Income', amount: 250.00, date: '2025-04-08', type: 'income', icon: 'income' },
  { id: 18, name: 'Salary', category: 'Income', amount: 3450.00, date: '2025-03-18', type: 'income', icon: 'income' },
  { id: 19, name: 'Internet Bill', category: 'Utilities', amount: -59.99, date: '2025-03-05', type: 'expense', icon: 'home' },
  { id: 20, name: 'Bonus', category: 'Income', amount: 200.00, date: '2025-03-25', type: 'income', icon: 'income' },
];

// Component
const WealthGuardDashboard = () => {
  const navigate = useNavigate();
  
  // Get user data from context
  const { user } = useUser() || {};
  
  // User info state
  const [userData, setUserData] = useState({
    username: "Guest User", 
    nickname: "Guest"
  });
  
  // State variables
  const [currentFinancialData, setCurrentFinancialData] = useState({
    income: { amount: 0, change: '+0%' },
    expenses: { amount: 0, change: '+0%' },
    balance: { amount: 0, change: '+0%' }
  });
  const [currentChartData, setCurrentChartData] = useState([]);
  const [currentSpendingData, setCurrentSpendingData] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]); // Will store array of objects with {id, name}
  const [goalsProgress, setGoalsProgress] = useState({});
  const [selectedGoal, setSelectedGoal] = useState("");
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [newGoalAmount, setNewGoalAmount] = useState("");
  const [activePage] = useState("Dashboard");
  const [timeframe, setTimeframe] = useState('Month');
  const [spendingTimeframe, setSpendingTimeframe] = useState('Last Month');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editGoalName, setEditGoalName] = useState("");
  const [editGoalTarget, setEditGoalTarget] = useState("");
  const [goalBeingEdited, setGoalBeingEdited] = useState("");
  
  // Get theme context
  const { 
    theme, 
    colorTheme, 
    fontSize 
  } = useThemeLanguage();
  
  // Notifications
  const [notifications] = useState([
    {
      id: 1,
      title: "Payment Reminder",
      message: "Your subscription payment is due in 3 days",
      date: "2 hours ago",
      read: false
    },
    {
      id: 2,
      title: "Budget Alert",
      message: "You've spent 80% of your Entertainment budget this month",
      date: "1 day ago",
      read: true
    },
    {
      id: 3,
      title: "New Feature",
      message: "Try our new goal tracking feature!",
      date: "3 days ago",
      read: true
    }
  ]);

  const processGoalData = (data) => {
    // Create a processed goals array with proper ID and name properties
    const processedGoals = data.map(goal => ({
      id: goal.id,
      name: goal.name
    }));
    
    // Create progress data with numeric values
    const progressData = {};
    data.forEach(goal => {
      progressData[goal.name] = {
        current: Number(goal.current) || 0,
        target: Number(goal.target) || 1
      };
    });
    
    return { processedGoals, progressData };
  };
  
   // Generate chart data based on timeframe
   const generateChartData = (period, txns) => {
    const now = new Date();
    let data = [];
    
    switch(period) {
      case "Day":
        // Hours in a day
        for (let i = 0; i < 24; i++) {
          const hour = `${i}:00`;
          const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), i, 0, 0);
          const hourEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), i, 59, 59);
          
          const hourTxns = txns.filter(t => {
            const txDate = new Date(t.date);
            return txDate >= hourStart && txDate <= hourEnd;
          });
          
          const income = hourTxns
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          const expenses = hourTxns
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          const balance = income - expenses;
          
          data.push({ name: hour, income, expenses, balance });
        }
        break;
        
      case "Week":
        // Days in a week
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
          const day = new Date(now);
          day.setDate(now.getDate() - i);
          
          const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
          const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);
          
          const dayTxns = txns.filter(t => {
            const txDate = new Date(t.date);
            return txDate >= dayStart && txDate <= dayEnd;
          });
          
          const income = dayTxns
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          const expenses = dayTxns
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          const balance = income - expenses;
          
          data.push({ name: dayNames[day.getDay()], income, expenses, balance });
        }
        break;
        
      case "Month":
        // Weeks in a month
        for (let i = 0; i < 4; i++) {
          const weekStart = new Date(now);
          weekStart.setDate(1 + (i * 7));
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          
          const weekTxns = txns.filter(t => {
            const txDate = new Date(t.date);
            return txDate >= weekStart && txDate <= weekEnd;
          });
          
          const income = weekTxns
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          const expenses = weekTxns
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          const balance = income - expenses;
          
          data.push({ name: `Week ${i+1}`, income, expenses, balance });
        }
        break;
        
      case "Year":
        // Months in a year
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i < 12; i++) {
          const monthStart = new Date(now.getFullYear(), i, 1);
          const monthEnd = new Date(now.getFullYear(), i + 1, 0);
          
          const monthTxns = txns.filter(t => {
            const txDate = new Date(t.date);
            return txDate >= monthStart && txDate <= monthEnd;
          });
          
          const income = monthTxns
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          const expenses = monthTxns
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          const balance = income - expenses;
          
          data.push({ name: monthNames[i], income, expenses, balance });
        }
        break;
    }
    
    return data;
  };

  // Calculate financial metrics based on timeframe
  const calculateFinancialMetrics = (txns, timeframe) => {
    if (!txns || txns.length === 0) return;

    // Get current date for filtering
    const currentDate = new Date();
    
    // Filter transactions based on selected timeframe
    let filteredTransactions = [];
    let previousPeriodTransactions = [];
    let currentPeriodLabel = '';
    let previousPeriodLabel = '';
    
    switch(timeframe) {
      case 'Day':
        // Filter for current day
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        filteredTransactions = txns.filter(t => {
          const txDate = new Date(t.date);
          return txDate.getFullYear() === today.getFullYear() && 
                txDate.getMonth() === today.getMonth() && 
                txDate.getDate() === today.getDate();
        });
        
        previousPeriodTransactions = txns.filter(t => {
          const txDate = new Date(t.date);
          return txDate.getFullYear() === yesterday.getFullYear() && 
                txDate.getMonth() === yesterday.getMonth() && 
                txDate.getDate() === yesterday.getDate();
        });
        
        currentPeriodLabel = 'Today';
        previousPeriodLabel = 'Yesterday';
        break;
        
      case 'Week':
        // Filter for current week (assuming week starts on Sunday)
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        const startOfPrevWeek = new Date(startOfWeek);
        startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7);
        
        const endOfPrevWeek = new Date(endOfWeek);
        endOfPrevWeek.setDate(endOfPrevWeek.getDate() - 7);
        
        filteredTransactions = txns.filter(t => {
          const txDate = new Date(t.date);
          return txDate >= startOfWeek && txDate <= endOfWeek;
        });
        
        previousPeriodTransactions = txns.filter(t => {
          const txDate = new Date(t.date);
          return txDate >= startOfPrevWeek && txDate <= endOfPrevWeek;
        });
        
        currentPeriodLabel = 'This Week';
        previousPeriodLabel = 'Last Week';
        break;
        
      case 'Month':
        // Filter for current month
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const startOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const endOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        
        filteredTransactions = txns.filter(t => {
          const txDate = new Date(t.date);
          return txDate >= startOfMonth && txDate <= endOfMonth;
        });
        
        previousPeriodTransactions = txns.filter(t => {
          const txDate = new Date(t.date);
          return txDate >= startOfPrevMonth && txDate <= endOfPrevMonth;
        });
        
        currentPeriodLabel = 'This Month';
        previousPeriodLabel = 'Last Month';
        break;
        
      case 'Year':
        // Filter for current year
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
        
        const startOfPrevYear = new Date(currentDate.getFullYear() - 1, 0, 1);
        const endOfPrevYear = new Date(currentDate.getFullYear() - 1, 11, 31);
        
        filteredTransactions = txns.filter(t => {
          const txDate = new Date(t.date);
          return txDate >= startOfYear && txDate <= endOfYear;
        });
        
        previousPeriodTransactions = txns.filter(t => {
          const txDate = new Date(t.date);
          return txDate >= startOfPrevYear && txDate <= endOfPrevYear;
        });
        
        currentPeriodLabel = 'This Year';
        previousPeriodLabel = 'Last Year';
        break;
        
      default:
        // Default to month
        filteredTransactions = txns.filter(t => {
          const txDate = new Date(t.date);
          return txDate.getMonth() === currentDate.getMonth() && 
                txDate.getFullYear() === currentDate.getFullYear();
        });
        
        previousPeriodTransactions = txns.filter(t => {
          const txDate = new Date(t.date);
          return txDate.getMonth() === (currentDate.getMonth() - 1) && 
                txDate.getFullYear() === currentDate.getFullYear();
        });
        
        currentPeriodLabel = 'This Month';
        previousPeriodLabel = 'Last Month';
        break;
    }

    // Calculate current period financial metrics
    const currentIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const currentExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const currentBalance = currentIncome - currentExpenses;

    // Calculate previous period financial metrics
    const previousIncome = previousPeriodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const previousExpenses = previousPeriodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const previousBalance = previousIncome - previousExpenses;

    // Calculate change percentages
    const calculateChangePercentage = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      
      const percentChange = ((current - previous) / Math.abs(previous)) * 100;
      return `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
    };

    const incomeChange = calculateChangePercentage(currentIncome, previousIncome);
    const expensesChange = calculateChangePercentage(currentExpenses, previousExpenses);
    const balanceChange = calculateChangePercentage(currentBalance, previousBalance);

    setCurrentFinancialData({
      income: { amount: currentIncome, change: incomeChange },
      expenses: { amount: currentExpenses, change: expensesChange },
      balance: { amount: currentBalance, change: balanceChange },
      labels: { current: currentPeriodLabel, previous: previousPeriodLabel }
    });
  };

  // Process transaction data for various components
  const processTransactionsData = (txns) => {
    // Set recent transactions
    if (txns.length > 0) {
      // Sort by date (newest first) and get top 5
      const sorted = [...txns].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setRecentTransactions(sorted.slice(0, 5));
    }
    
    // Update chart data based on the timeframe
    const chartData = generateChartData(timeframe, txns);
    setCurrentChartData(chartData);
    
    // Update spending data
    // Filter transactions based on timeframe and type='expense'
    const expenseTransactions = filterTransactionsByTimeframe(txns, spendingTimeframe)
      .filter(t => t.type === 'expense');
  
    // Group expenses by category
    const categoryExpenses = {};
    expenseTransactions.forEach(t => {
      if (!categoryExpenses[t.category]) {
        categoryExpenses[t.category] = 0;
      }
      categoryExpenses[t.category] += Math.abs(t.amount);
    });
  
    // Convert to array format for chart
    const spendingData = Object.keys(categoryExpenses).map(category => ({
      name: category,
      value: categoryExpenses[category]
    }));
  
    setCurrentSpendingData(spendingData);
    setTotalSpending(expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0));
    
    // Calculate financial metrics based on timeframe
    calculateFinancialMetrics(txns, timeframe);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Veri çekme için token bulunamadı");
        setTransactions(mockTransactions);
        processTransactionsData(mockTransactions);
        return;
      }
      
      console.log("Dashboard verileri çekiliyor...");
      
      // Paralel olarak birden fazla veri kaynağından veri çek
      const [transactionData, paymentData] = await Promise.all([
        TransactionService.getAllTransactions().catch(err => {
          console.error("Transaction verisi çekilirken hata:", err);
          return [];
        }),
        PaymentService.getAllPayments().catch(err => {
          console.error("Payment verisi çekilirken hata:", err);
          return [];
        })
      ]);
      
      console.log("API'den gelen transaction verisi:", transactionData?.length || 0, "kayıt");
      console.log("API'den gelen payment verisi:", paymentData?.length || 0, "kayıt");
      
      // Verinin içeriğini detaylı olarak kontrol etmek için bir kaç örnek kayıt göster
      if (transactionData && transactionData.length > 0) {
        console.log("Örnek transaction verisi:", transactionData[0]);
      }
      if (paymentData && paymentData.length > 0) {
        console.log("Örnek payment verisi:", paymentData[0]);
      }
      
      // Tüm veri kaynaklarını birleştir
      let combinedData = [...(transactionData || [])];
      
      // Payment verileri varsa, onları transaction formatına dönüştür ve ekle
      if (paymentData && paymentData.length > 0) {
        // Payment verilerini standart formata dönüştür
        const formattedPayments = paymentData.map(payment => {
          // Eksik alanlar için varsayılan değerler belirle
          const paymentType = payment.type || 'expense';
          const amount = paymentType === 'expense' ? 
            -Math.abs(Number(payment.amount || 0)) : 
            Math.abs(Number(payment.amount || 0));
          
          return {
            id: payment.id || `payment-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: payment.description || payment.title || payment.name || "Ödeme",
            category: payment.category || "Ödeme",
            amount: amount,
            date: payment.date || payment.paymentDate || payment.created_at || new Date().toISOString().split('T')[0],
            type: paymentType,
            icon: payment.icon || (paymentType === 'income' ? 'income' : 'credit-card'),
            source: 'payment' // Veri kaynağını takip etmek için
          };
        });
        
        console.log("Formatlanan payment verileri:", formattedPayments.length);
        combinedData = [...combinedData, ...formattedPayments];
        console.log("Birleştirilmiş veri toplam:", combinedData.length);
      }
      
      // Verileri sırala ve işle
      if (combinedData && combinedData.length > 0) {
        console.log("Gerçek veriler kullanılıyor:", combinedData.length, "adet işlem bulundu");
        
        // Veriyi tarihe göre sırala (en yeni en üstte)
        combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setTransactions(combinedData);
        processTransactionsData(combinedData);
      } else {
        // Veri yoksa mock data kullan
        console.log("API'den hiç veri gelmedi, mock data kullanılıyor");
        setTransactions(mockTransactions);
        processTransactionsData(mockTransactions);
      }
    } catch (error) {
      console.error('Dashboard verileri çekilirken hata oluştu:', error);
      // Hata durumunda mock data kullan
      console.log("Hata nedeniyle mock data kullanılıyor");
      setTransactions(mockTransactions);
      processTransactionsData(mockTransactions);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, [timeframe, spendingTimeframe]);

  // Veri değişimini izlemek için ek useEffect
useEffect(() => {
  // Transactions state'i değiştiğinde log mesajı yazdır
  console.log("Transactions state güncellendi, kayıt sayısı:", transactions.length);
  
  // State'te veri varsa ve mock data kullanılmıyorsa, gerçek veri geldi demektir
  if (transactions.length > 0 && transactions[0].id !== mockTransactions[0].id) {
    console.log("Gerçek veri kullanılıyor!");
  } else if (transactions.length > 0) {
    console.log("Mock data kullanılıyor!");
  }
}, [transactions]);

  // Authentication verification effect
  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        // Use the session validation method
        if (!AuthService.isSessionValid()) {
          console.error("Session invalid, redirecting to login");
          navigate('/');
          return;
        }
      } catch (error) {
        console.error("Authentication error:", error);
        // Only redirect on auth errors, not on network errors
        if (error.name !== 'NetworkError') {
          navigate('/');
        }
      }
    };
  
    verifyAuthentication();
  }, [navigate]);
  
  // Fetch user data
  useEffect(() => {
    // Token kontrolü
    const checkAuth = () => {
      const isAuthenticated = AuthService.isSessionValid();
      if (!isAuthenticated) {
        console.log("Oturum geçersiz, giriş sayfasına yönlendiriliyor...");
        navigate('/signin');
        return;
      }
      
      // Kullanıcı bilgilerini getir
      const fetchUserData = async () => {
        try {
          const userData = await AuthService.fetchUserDetails();
          setUserData({
            username: userData.name || "Guest User",
            nickname: userData.nickname || "Guest"
          });
        } catch (error) {
          console.error("Kullanıcı bilgilerini getirme hatası:", error);
          // Hata durumunda oturumu sonlandır
          AuthService.logout();
          navigate('/signin');
        }
      };
      
      fetchUserData();
    };
    
    checkAuth();
  }, [navigate]);
  
  // Update username and nickname when user data changes
  useEffect(() => {
    if (user) {
      setUserData({
        username: user.name || "Guest User",
        nickname: user.nickname || "Guest"
      });
    }
  }, [user]);
  
  // Apply font size class to the body
  useEffect(() => {
    document.body.classList.remove('text-sm', 'text-base', 'text-lg');
    if (fontSize === 'small') {
      document.body.classList.add('text-sm');
    } else if (fontSize === 'large') {
      document.body.classList.add('text-lg');
    } else {
      document.body.classList.add('text-base');
    }
  }, [fontSize]);

  // Fetch goals data
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token not found for goal fetch");
          // Set default goals if no token
          const defaultGoals = [
            {id: 1, name: "First home"},
            {id: 2, name: "New car"},
            {id: 3, name: "Vacation"}
          ];
          
          const progressData = {
            "First home": { current: 3190, target: 24000 },
            "New car": { current: 1200, target: 8000 },
            "Vacation": { current: 800, target: 3000 }
          };
          
          setGoals(defaultGoals);
          setGoalsProgress(progressData);
          
          // Select first goal
          if (defaultGoals.length > 0) {
            setSelectedGoal(defaultGoals[0].name);
          }
          return;
        }
        
        const data = await GoalService.getAllGoals();
        console.log("Goals data from API:", data);
        
        if (data && data.length > 0) {
          // Process the data to ensure numeric values
          const { processedGoals, progressData } = processGoalData(data);
          
          // Store the processed data
          setGoals(processedGoals);
          setGoalsProgress(progressData);
          
          // Select first goal
          if (processedGoals.length > 0) {
            setSelectedGoal(processedGoals[0].name);
          }
        } else {
          console.log("No goals found from API, using default goals");
          // Use default goals
          const defaultGoals = [
            {id: 1, name: "First home"},
            {id: 2, name: "New car"},
            {id: 3, name: "Vacation"}
          ];
          
          const progressData = {
            "First home": { current: 3190, target: 24000 },
            "New car": { current: 1200, target: 8000 },
            "Vacation": { current: 800, target: 3000 }
          };
          
          setGoals(defaultGoals);
          setGoalsProgress(progressData);
          
          if (defaultGoals.length > 0) {
            setSelectedGoal(defaultGoals[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
        // Keep default mock data on error
        const defaultGoals = [
          {id: 1, name: "First home"},
          {id: 2, name: "New car"},
          {id: 3, name: "Vacation"}
        ];
        
        const progressData = {
          "First home": { current: 3190, target: 24000 },
          "New car": { current: 1200, target: 8000 },
          "Vacation": { current: 800, target: 3000 }
        };
        
        setGoals(defaultGoals);
        setGoalsProgress(progressData);
        
        if (defaultGoals.length > 0) {
          setSelectedGoal(defaultGoals[0].name);
        }
      }
    };
    
    fetchGoals();
  }, []);
  
  // Event handlers
  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  const handleSubmitNewGoal = async () => {
    if (newGoalName && newGoalName.trim() !== "" && newGoalTarget && !isNaN(Number(newGoalTarget)) && Number(newGoalTarget) > 0) {
      try {
        const response = await GoalService.addGoal({
          name: newGoalName,
          target: Number(newGoalTarget),
          current: 0
        });
        
        console.log("Goal added successfully:", response);
        
        // Update UI with the new goal
        const newGoalObj = {
          id: response?.id || Date.now(), // Use response ID or fallback to timestamp
          name: newGoalName
        };
        
        // Update goals list
        setGoals([...goals, newGoalObj]);
        
        // Update progress data
        setGoalsProgress({
          ...goalsProgress,
          [newGoalName]: { current: 0, target: Number(newGoalTarget) }
        });
        
        // Select the new goal
        setSelectedGoal(newGoalName);
      } catch (error) {
        console.error('Hedef ekleme hatası:', error);
        
        // Even if API call fails, update the UI for better UX
        const newGoalObj = {
          id: Date.now(), // Fallback to timestamp as ID
          name: newGoalName
        };
        
        setGoals([...goals, newGoalObj]);
        setGoalsProgress({
          ...goalsProgress,
          [newGoalName]: { current: 0, target: Number(newGoalTarget) }
        });
        setSelectedGoal(newGoalName);
      } finally {
        setNewGoalName("");
        setNewGoalTarget("");
        setIsAddingGoal(false);
      }
    }
  };

  const handleDeleteGoal = async (goalToDelete) => {
    if (!goalToDelete) {
      console.error("Goal to delete is not valid");
      return;
    }
    
    if (goals.length <= 1) {
      alert("En az bir tasarruf hedefi bulunmalıdır.");
      return;
    }
    
    try {
      // Find the goal object with the matching name
      const goalObj = goals.find(g => g.name === goalToDelete);
      
      if (!goalObj) {
        console.error("Goal not found in goals list");
        return;
      }
      
      console.log("Deleting goal with ID:", goalObj.id);
      
      // Use the actual goal ID from the database
      await GoalService.deleteGoal(goalObj.id);
      
      // Update UI
      const updatedGoals = goals.filter(g => g.name !== goalToDelete);
      const updatedProgress = { ...goalsProgress };
      delete updatedProgress[goalToDelete];
      
      setGoals(updatedGoals);
      setGoalsProgress(updatedProgress);
      
      if (selectedGoal === goalToDelete && updatedGoals.length > 0) {
        setSelectedGoal(updatedGoals[0].name);
      }
    } catch (error) {
      console.error('Hedef silme hatası:', error);
      
      // Update UI even on error for better UX
      const updatedGoals = goals.filter(g => g.name !== goalToDelete);
      const updatedProgress = { ...goalsProgress };
      delete updatedProgress[goalToDelete];
      
      setGoals(updatedGoals);
      setGoalsProgress(updatedProgress);
      
      if (selectedGoal === goalToDelete && updatedGoals.length > 0) {
        setSelectedGoal(updatedGoals[0].name);
      }
    }
  };
  
  const handleSubmitAddMoney = async () => {
    if (!selectedGoal || !(selectedGoal in goalsProgress)) {
      return;
    }
    
    if (newGoalAmount && !isNaN(Number(newGoalAmount)) && Number(newGoalAmount) > 0) {
      const amountNum = Number(newGoalAmount);
      
      try {
        // Find the goal object with the matching name
        const goalObj = goals.find(g => g.name === selectedGoal);
        
        if (!goalObj) {
          console.error("Goal not found in goals list");
          return;
        }
        
        console.log("Adding money to goal with ID:", goalObj.id, "Amount:", amountNum);
        
        // Use the actual goal ID from the database
        await GoalService.addMoneyToGoal(goalObj.id, amountNum);
        
        // Update UI - ensure we're working with numbers
        const currentAmount = Number(goalsProgress[selectedGoal].current);
        
        setGoalsProgress({
          ...goalsProgress,
          [selectedGoal]: {
            ...goalsProgress[selectedGoal],
            current: currentAmount + amountNum
          }
        });
      } catch (error) {
        console.error('Hedefe para ekleme hatası:', error);
        
        // Update UI even on error - ensure we're working with numbers
        const currentAmount = Number(goalsProgress[selectedGoal].current);
        
        setGoalsProgress({
          ...goalsProgress,
          [selectedGoal]: {
            ...goalsProgress[selectedGoal],
            current: currentAmount + amountNum
          }
        });
      } finally {
        setNewGoalAmount("");
        setShowGoalInput(false);
      }
    }
  };
  
  const handleSpendingTimeframeChange = (e) => {
    setSpendingTimeframe(e.target.value);
  };
  
  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };
  
  const handleCancelEdit = () => {
    setIsEditingGoal(false);
    setEditGoalName("");
    setEditGoalTarget("");
    setGoalBeingEdited("");
  };
  
  const handleAddMoney = () => {
    setShowGoalInput(true);
  };
  
  const handleNavClick = (pageName) => {
    if (pageName !== "Dashboard") {
      navigate(`/${pageName.toLowerCase()}`);
    }
  };
  
  const handleEditGoal = (goalName) => {
    if (!goalName || !(goalName in goalsProgress)) {
      return;
    }
    
    setGoalBeingEdited(goalName);
    setEditGoalName(goalName);
    setEditGoalTarget(goalsProgress[goalName].target.toString());
    setIsEditingGoal(true);
  };
  
  const handleSaveEditedGoal = async () => {
    if (!goalBeingEdited || !(goalBeingEdited in goalsProgress)) {
      return;
    }
    
    if (editGoalName && editGoalName.trim() !== "" && 
        editGoalTarget && !isNaN(Number(editGoalTarget)) && Number(editGoalTarget) > 0) {
      
      try {
        // Find the goal object with the matching name
        const goalObj = goals.find(g => g.name === goalBeingEdited);
        
        if (!goalObj) {
          console.error("Goal not found in goals list");
          return;
        }
        
        console.log("Updating goal with ID:", goalObj.id);
        
        // Use the actual goal ID
        await GoalService.updateGoal(goalObj.id, {
          name: editGoalName,
          target: Number(editGoalTarget),
          current: goalsProgress[goalBeingEdited].current
        });
        
        // Update local state
        const updatedGoals = goals.map(g => {
          if (g.name === goalBeingEdited) {
            return { ...g, name: editGoalName };
          }
          return g;
        });
        
        const updatedGoalsProgress = { ...goalsProgress };
        if (editGoalName !== goalBeingEdited) {
          updatedGoalsProgress[editGoalName] = {
            current: goalsProgress[goalBeingEdited].current,
            target: Number(editGoalTarget)
          };
          delete updatedGoalsProgress[goalBeingEdited];
        } else {
          updatedGoalsProgress[goalBeingEdited] = {
            ...updatedGoalsProgress[goalBeingEdited],
            target: Number(editGoalTarget)
          };
        }
        
        setGoals(updatedGoals);
        setGoalsProgress(updatedGoalsProgress);
        
        if (selectedGoal === goalBeingEdited) {
          setSelectedGoal(editGoalName);
        }
      } catch (error) {
        console.error('Hedef güncelleme hatası:', error);
        
        // Update UI even on error
        const updatedGoals = goals.map(g => {
          if (g.name === goalBeingEdited) {
            return { ...g, name: editGoalName };
          }
          return g;
        });
        
        const updatedGoalsProgress = { ...goalsProgress };
        if (editGoalName !== goalBeingEdited) {
          updatedGoalsProgress[editGoalName] = {
            current: goalsProgress[goalBeingEdited].current,
            target: Number(editGoalTarget)
          };
          delete updatedGoalsProgress[goalBeingEdited];
        } else {
          updatedGoalsProgress[goalBeingEdited] = {
            ...updatedGoalsProgress[goalBeingEdited],
            target: Number(editGoalTarget)
          };
        }
        
        setGoals(updatedGoals);
        setGoalsProgress(updatedGoalsProgress);
        
        if (selectedGoal === goalBeingEdited) {
          setSelectedGoal(editGoalName);
        }
      } finally {
        // Reset form
        setIsEditingGoal(false);
        setEditGoalName("");
        setEditGoalTarget("");
        setGoalBeingEdited("");
      }
    }
  };
  
  // Helper utility functions
  // Filter transactions based on selected timeframe
  const filterTransactionsByTimeframe = (txns, period) => {
    const today = new Date();
    const periodStartDate = new Date();
    
    switch(period) {
      case "Last Day":
        periodStartDate.setDate(today.getDate() - 1);
        break;
      case "Last Week":
        periodStartDate.setDate(today.getDate() - 7);
        break;
      case "Last Month":
        periodStartDate.setMonth(today.getMonth() - 1);
        break;
      case "Last Year":
        periodStartDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        periodStartDate.setMonth(today.getMonth() - 1); // Default to last month
        break;
    }
    
    return txns.filter(tx => new Date(tx.date) >= periodStartDate);
  };

  // Method to get the appropriate color class based on current theme
  const getThemeClass = (purpleClass, blueClass) => {
    return colorTheme === 'blue' ? blueClass : purpleClass;
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
    <div className={`h-screen w-screen font-worksans flex flex-col justify-between ${bgMainClass} p-8 overflow-hidden`}>
      <div className="flex-1 flex justify-center items-center">
        <div className={`mx-auto h-[calc(100vh-100px)] flex ${bgCardClass} rounded-3xl shadow-lg overflow-hidden w-full max-w-10xl`}>
  
          {/* sidebar */}
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
  
              {/* main navigation */}
              <div className={`p-6 border-b ${borderClass}`}>
                <h3 className={`text-xs uppercase ${textSecondaryClass} mb-2`}>MAIN</h3>
                <Link to="/maindashboard" 
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${activePage === "Dashboard" ? getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600') : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Dashboard")}
                >
                  <FaHome className="mr-3" />
                  <span className="font-medium">Dashboard</span>
                </Link>
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
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* header */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div>
                    <h2 className={`font-medium ${textMainClass}`}>{userData.username}</h2>
                    <span className={`text-sm ${textSecondaryClass}`}>{userData.nickname}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className={`p-2 ${textSecondaryClass} mr-4`} onClick={() => setNotificationModalOpen(true)}><FaBell /></button>
                </div>
              </div>
  
              {/* Budget Overview - takes 2/3 of the width */}
              <div className={`lg:col-span-2 p-3 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm mb-2`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-2xl font-bold ${textMainClass}`}>Budget Overview</h2>
                  <div className="relative">
                    <select
                      className={`${inputBgClass} border ${inputBorderClass} rounded-md px-4 py-2 pr-8 text-sm appearance-none ${textMainClass}`}
                      value={timeframe}
                      onChange={handleTimeframeChange}
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
                      <div className={`w-3 h-3 ${colorTheme === 'blue' ? 'bg-blue-500' : 'bg-purple-500'} rounded-full mr-2`}></div>
                      <span className={`text-sm ${textSecondaryClass}`}>Income</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 ${colorTheme === 'blue' ? 'bg-blue-300' : 'bg-purple-300'} rounded-full mr-2`}></div>
                      <span className={`text-sm ${textSecondaryClass}`}>Expenses</span>
                    </div>
                  </div>
                </div>
  
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
                    <div className="flex items-center mb-2">
                      <div className={`w-2 h-2 ${colorTheme === 'blue' ? 'bg-blue-500' : 'bg-purple-500'} rounded-full mr-2`}></div>
                      <span className={`text-xs ${textSecondaryClass} uppercase`}>INCOME</span>
                      <span className={`ml-2 text-xs ${currentFinancialData.income.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {currentFinancialData.income.change}
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${textMainClass}`}>${currentFinancialData.income.amount.toLocaleString()}</div>
                  </div>
  
                  <div className={`p-4 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
                    <div className="flex items-center mb-2">
                      <div className={`w-2 h-2 ${colorTheme === 'blue' ? 'bg-blue-300' : 'bg-purple-300'} rounded-full mr-2`}></div>
                      <span className={`text-xs ${textSecondaryClass} uppercase`}>EXPENSES</span>
                      <span className={`ml-2 text-xs ${currentFinancialData.expenses.change.includes('-') ? 'text-green-500' : 'text-red-500'}`}>
                        {currentFinancialData.expenses.change}
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${textMainClass}`}>${currentFinancialData.expenses.amount.toLocaleString()}</div>
                  </div>
  
                  <div className={`p-4 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
                    <div className="flex items-center mb-2">
                      <div className={`w-2 h-2 ${colorTheme === 'blue' ? 'bg-blue-400' : 'bg-purple-400'} rounded-full mr-2`}></div>
                      <span className={`text-xs ${textSecondaryClass} uppercase`}>BALANCE</span>
                      <span className={`ml-2 text-xs ${currentFinancialData.income.amount - currentFinancialData.expenses.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {(currentFinancialData.income.amount - currentFinancialData.expenses.amount) > 0 ? '+' : '-'}
                        ${Math.abs(currentFinancialData.income.amount - currentFinancialData.expenses.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${textMainClass}`}>
                      ${Math.abs(currentFinancialData.income.amount - currentFinancialData.expenses.amount).toLocaleString()}
                    </div>
                  </div>
                </div>
  
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        stroke={colorTheme === 'blue' ? '#3b82f6' : "#8b5cf6"} 
                        strokeWidth={3} 
                        dot={{ r: 3 }} 
                        activeDot={{ r: 5 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke={colorTheme === 'blue' ? '#93c5fd' : "#d8b4fe"} 
                        strokeWidth={3} 
                        dot={{ r: 3 }} 
                        activeDot={{ r: 5 }} 
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value.toLocaleString()}`, name === "income" ? "Income" : "Expenses"]}
                        labelFormatter={(label) => `${label}`}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
  
              {/* bottom 3 sections */}
              <div className="grid grid-cols-3 gap-6">
                {/* recent transaction */}
                <div className={`p-6 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold ${textMainClass}`}>Recent Transactions</h3>
                  </div>
  
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div>
                            <div className={`text-sm font-medium ${textMainClass}`}>{transaction.name}</div>
                            <div className={`text-xs ${textSecondaryClass}`}>{transaction.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                          <div className={`text-xs ${textSecondaryClass}`}>{formatDate(transaction.date)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
  
                  <a href="recurringtransactionpage" className={`w-full mt-4 py-2 ${getThemeClass('bg-purple-500 hover:bg-purple-600', 'bg-blue-500 hover:bg-blue-600')} text-white rounded-lg font-medium flex items-center justify-center`}>
                    See All Transactions
                  </a>
                </div>
                
               {/* Spending Summary */}
              <div className={`p-6 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-bold ${textMainClass}`}>Spending Summary</h3>
                  <div className="relative">
                    <select
                      className={`${inputBgClass} border ${inputBorderClass} rounded-md px-3 py-1 pr-8 text-sm appearance-none ${textMainClass}`}
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
                          innerRadius={20}
                          outerRadius={40}
                          fill="#8884d8"
                          paddingAngle={0}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {currentSpendingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} 
                              fill={colorTheme === 'blue' ? 
                                ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'][index % 5] : 
                                ['#8b5cf6', '#a78bfa', '#c084fc', '#ddd6fe', '#f5f3ff'][index % 5]
                              } 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value.toFixed(2)}`, '']}
                          itemStyle={{ color: theme === 'dark' ? '#fff' : '#333' }}
                          contentStyle={{ 
                            background: theme === 'dark' ? '#374151' : '#fff', 
                            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="mt-4">
                  {currentSpendingData.length > 0 ? (
                    <div>
                      <div className="text-center">
                        <div className={`text-lg font-semibold ${textMainClass}`}>${totalSpending.toFixed(2)}</div>
                        <div className={`text-sm ${textSecondaryClass}`}>Total Spending</div>
                      </div>
                    </div>
                  ) : (
                    <div className={`text-center ${textSecondaryClass}`}>
                      No spending data available for this period
                    </div>
                  )}
                </div>
              </div>
  
               {/* Goals section */}
            <div className={`p-6 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm`}>
            <h4 className={`font-bold ${textMainClass} mb-2`}>Track Goals</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center">
                  <button
                    onClick={() => setSelectedGoal(goal.name)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedGoal === goal.name ? 
                        getThemeClass('bg-purple-500 text-white', 'bg-blue-500 text-white') : 
                        getThemeClass('bg-gray-200', 'bg-gray-400')
                    }`}>
                    {goal.name}
                  </button>
                  <div className="flex ml-1">
                    <button 
                      onClick={() => handleEditGoal(goal.name)}
                      className={`${getThemeClass('text-purple-500 hover:text-purple-700', 'text-blue-500 hover:text-blue-700')} mr-1`}>
                      <FaCog size={12} />
                    </button>
                    <button 
                      onClick={() => handleDeleteGoal(goal.name)}
                      className="text-red-500 hover:text-red-700">
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setIsAddingGoal(true)}
                className={`px-3 py-2 ${getThemeClass('bg-purple-100 text-purple-700 hover:bg-purple-200', 'bg-blue-100 text-blue-700 hover:bg-blue-200')} rounded-full text-sm font-bold`}
              >
                <FaPlus />
              </button>
            </div>
            
            {/* Edit goal form */}
            {isEditingGoal && (
              <div className={`mb-4 p-4 border ${getThemeClass('border-purple-200 bg-purple-50', 'border-blue-200 bg-blue-50')} rounded-lg`}>
                <h5 className={`font-medium ${getThemeClass('text-purple-700', 'text-blue-700')} mb-3`}>Edit Goal</h5>
                <input
                  type="text"
                  value={editGoalName}
                  onChange={(e) => setEditGoalName(e.target.value)}
                  placeholder="Goal name"
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md mb-2`}
                />
                <input
                  type="number"
                  value={editGoalTarget}
                  onChange={(e) => setEditGoalTarget(e.target.value)}
                  placeholder="Target amount ($)"
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md mb-2`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEditedGoal}
                    className={`px-4 py-2 ${getThemeClass('bg-purple-500 hover:bg-purple-600', 'bg-blue-500 hover:bg-blue-600')} text-white rounded-md flex-1`}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className={`px-4 py-2 ${getThemeClass('bg-gray-200 text-gray-400 hover:bg-gray-300', 'bg-gray-600 text-gray-200 hover:bg-gray-600')} rounded-md flex-1`}
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
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md mb-2`}
                />
                <input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  placeholder="Enter target amount ($)"
                  className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md mb-2`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitNewGoal}
                    className={`px-4 py-2 ${getThemeClass('bg-purple-500 hover:bg-purple-600', 'bg-blue-500 hover:bg-blue-600')} text-white rounded-md flex-1`}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingGoal(false);
                      setNewGoalName("");
                      setNewGoalTarget("");
                    }}
                    className={`px-4 py-2 ${getThemeClass('bg-gray-200 text-gray-500 hover:bg-gray-300', 'bg-gray-700 text-gray-200 hover:bg-gray-600')} rounded-md flex-1`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {/* Goal details and add money section */}
          {selectedGoal && !isAddingGoal && !isEditingGoal && goalsProgress[selectedGoal] && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className={textMainClass}>{selectedGoal}</span>
                <span className={textMainClass}>
                  ${Number(goalsProgress[selectedGoal].current).toFixed(2)} / ${Number(goalsProgress[selectedGoal].target).toFixed(2)}
                </span>
              </div>
              <div className={`w-full ${getThemeClass('bg-gray-200', 'bg-gray-500')} rounded-full h-2.5`}>
                <div 
                  className={`${getThemeClass('bg-purple-600', 'bg-blue-600')} h-2.5 rounded-full`} 
                  style={{ width: `${Math.min(100, (Number(goalsProgress[selectedGoal].current) / Number(goalsProgress[selectedGoal].target)) * 100)}%` }}
                ></div>
              </div>
              <div className={`text-right text-xs ${getThemeClass('text-gray-500', 'text-gray-400')} mt-1`}>
                {`${Math.min(100, Math.round((Number(goalsProgress[selectedGoal].current) / Number(goalsProgress[selectedGoal].target)) * 100))}%`}
              </div>
              
              {showGoalInput ? (
                <div className="mt-3">
                  <input
                    type="number"
                    value={newGoalAmount}
                    onChange={(e) => setNewGoalAmount(e.target.value)}
                    placeholder="Enter amount"
                    className={`w-full px-3 py-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md mb-2`}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSubmitAddMoney}
                      className={`px-4 py-2 ${getThemeClass('bg-purple-500 hover:bg-purple-600', 'bg-blue-500 hover:bg-blue-600')} text-white rounded-md flex-1`}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowGoalInput(false)}
                      className={`px-4 py-2 ${getThemeClass('bg-gray-200 text-gray-500 hover:bg-gray-300', 'bg-gray-700 text-gray-200 hover:bg-gray-600')} rounded-md flex-1`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleAddMoney}
                  className={`mt-3 px-4 py-2 ${getThemeClass('bg-purple-500 hover:bg-purple-600', 'bg-blue-500 hover:bg-blue-600')} text-white rounded-lg text-sm flex items-center justify-center w-full`}
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
            <footer className={`text-center text-sm ${textSecondaryClass} mt-8`}>© 2025 WealthGuard. All rights reserved.</footer>
            <NotificationModal
                open={notificationModalOpen}
                onClose={() => setNotificationModalOpen(false)}
                notifications={notifications}
              />
          </div>
    );
  };
  
  export default WealthGuardDashboard;

 