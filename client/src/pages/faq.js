import React, { useState,useEffect } from "react";
import {
  FaHome,
  FaChevronDown,
  FaClock,
  FaCreditCard,
  FaExchangeAlt,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useThemeLanguage } from "./ThemeLanguageContext";
import { useUser } from '../contexts/UserContext';

const SupportPage = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Support");
  const [activeTab, setActiveTab] = useState("contact");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useUser() || {};
  const [userData, setUserData] = useState({
      username: "Guest User", 
      nickname: "Guest"
    });


    useEffect(() => {
      if (user) {
        setUserData({
          username: user.name || "Guest User",
          nickname: user.nickname || "Guest"
        });
      }
    }, [user]);
  
  // Get theme context
  const { theme, colorTheme } = useThemeLanguage();

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    console.log(`Navigating to ${pageName}`);
    if (pageName !== "Support") {
      navigate(`/${pageName.toLowerCase()}`);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your support request has been submitted.");
    setEmail("");
    setSubject("");
    setMessage("");
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
  const detailsBgClass = theme === "dark" ? "bg-gray-800" : "bg-gray-50";
  const detailsHoverClass = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

  const faqs = [
    {
      question: "How do I add a new savings goal?",
      answer:
        "You can add a new savings goal by clicking the '+' button in the Savings section of your dashboard, then enter the name of your goal when prompted.",
    },
    {
      question: "How do I set up recurring payments?",
      answer:
        "To set up recurring payments, navigate to the Payments section from the sidebar menu, then click on 'Add Payment' and follow the instructions.",
    },
    {
      question: "How do I change my account settings?",
      answer:
        "To change your account settings, click on the 'Settings' option in the sidebar menu. From there, you can update your profile, notification preferences, and website settings.",
    },
  ];

  return (
    <div className={`h-screen w-screen font-worksans flex flex-col justify-between ${bgMainClass} p-8`}>
      <div className="flex-1 flex justify-center items-center">
        <div className={`mx-auto h-[calc(100vh-100px)] flex ${bgCardClass} rounded-3xl shadow-lg overflow-hidden w-full max-w-10xl`}>
          {/* Sidebar */}
          <div className={`w-64 border-r ${borderClass} flex flex-col justify-between`}>
            <div>
              <div className={`p-6 border-b ${borderClass}`}>
                <div className="flex items-center mb-2">
                  <div className="mr-2">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 object-cover" />
                  </div>
                  <a href="maindashboard" className={`text-2xl italic font-bold ${textMainClass}`}>
                    WealthGuard
                  </a>
                </div>
              </div>

              {/* Navigation menu */}
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
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "Support" ? `${getThemeClass('bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600')}` : `${textSecondaryClass} ${hoverBgClass}`}`}
                  onClick={() => handleNavClick("Support")}
                >
                  <FaQuestionCircle className="mr-3" />
                  <span>Support</span>
                </a>
              </div>
            </div>
              
            {/* Logout */}
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

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div>
                  <h2 className={`font-medium ${textMainClass}`}>{userData.username}</h2>
                  <span className={`text-sm ${textSecondaryClass}`}>{userData.nickname}</span>
                </div>
              </div>
              <div className="flex items-center">             
              </div>
            </div>

            {/* Support panel */}
            <div className={`p-6 ${bgCardClass} border ${borderClass} rounded-lg shadow-sm mb-6`}>
              <h2 className={`text-xl font-bold ${textMainClass} mb-6`}>Support Center</h2>

              {/* Tabs for support */}
              <div className={`flex border-b ${borderClass} mb-6`}>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "contact"
                      ? `${getThemeClass('text-purple-600 border-b-2 border-purple-600', 'text-blue-600 border-b-2 border-blue-600')}`
                      : `${textSecondaryClass} hover:${textMainClass}`
                  }`}
                  onClick={() => setActiveTab("contact")}
                >
                  Contact Us
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "faq"
                      ? `${getThemeClass('text-purple-600 border-b-2 border-purple-600', 'text-blue-600 border-b-2 border-blue-600')}`
                      : `${textSecondaryClass} hover:${textMainClass}`
                  }`}
                  onClick={() => setActiveTab("faq")}
                >
                  FAQ
                </button>
              </div>

              {activeTab === "contact" && (
                <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                  <div>
                    <label className={`block text-sm font-medium ${textMainClass} mb-1`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full p-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textMainClass} mb-1`}>Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={`w-full p-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textMainClass} mb-1`}>Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full p-2 border ${inputBorderClass} ${inputBgClass} ${textMainClass} rounded-md resize-none`}
                      rows={4}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`px-4 py-2 ${getThemeClass('bg-purple-600 hover:bg-purple-700', 'bg-blue-600 hover:bg-blue-700')} text-white rounded-md transition duration-300`}
                  >
                    Submit Request
                  </button>
                </form>
              )}

              {activeTab === "faq" && (
                <div>
                  <h3 className={`text-lg font-medium mb-4 ${textMainClass}`}>Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <details
                        key={index}
                        className={`border ${borderClass} rounded-lg overflow-hidden`}
                      >
                        <summary className={`flex justify-between items-center p-4 cursor-pointer ${detailsBgClass} ${detailsHoverClass}`}>
                          <span className={`font-medium ${textMainClass}`}>{faq.question}</span>
                          <FaChevronDown className={`${textSecondaryClass} transition-transform group-open:rotate-180`} />
                        </summary>
                        <div className={`p-4 border-t ${borderClass} ${textMainClass}`}>{faq.answer}</div>
                      </details>
                    ))}
                  </div>
                  <div className={`mt-6 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg text-center`}>
                    <p className={`font-medium ${textMainClass} mb-2`}>
                      Didn't find what you were looking for?
                    </p>
                    <button
                      onClick={() => setActiveTab("contact")}
                      className={`${getThemeClass('text-purple-600 hover:text-purple-800', 'text-blue-600 hover:text-blue-800')} font-medium`}
                    >
                      Contact Us!
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className={`text-center text-sm ${textSecondaryClass} mt-8`}>
        © 2025 WealthGuard. All rights reserved.
      </footer>
    </div>
  );
};

export default SupportPage;