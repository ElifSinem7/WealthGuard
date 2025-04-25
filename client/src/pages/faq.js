import React, { useState } from 'react';
import { FaHome, FaChevronDown, FaClock, FaCreditCard, FaExchangeAlt, FaCog, FaQuestionCircle, FaSignOutAlt, FaSearch, FaBell} from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import useThemeAndLanguageInit from '../hooks/useThemeAndLanguageInit';

const SupportPage = () => {

  useThemeAndLanguageInit();

  
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Support");
  const [activeTab, setActiveTab] = useState("contact");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const searchInputRef = React.useRef(null);
  
  const [username] = useState("examp name");
  const [nickname] = useState("examp nickname");

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    console.log(`Navigating to ${pageName}`);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Support Request:", { email, subject, message });
    alert("Your support request has been submitted.");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  const faqs = [
    {
      question: "How do I add a new savings goal?",
      answer: "You can add a new savings goal by clicking the '+' button in the Savings section of your dashboard, then enter the name of your goal when prompted."
    },
    {
      question: "How do I set up recurring payments?",
      answer: "To set up recurring payments, navigate to the Payments section from the sidebar menu, then click on 'Add Payment' and follow the instructions."
    },
    {
      question: "How do I change my account settings?",
      answer: "To change your account settings, click on the 'Settings' option in the sidebar menu. From there, you can update your profile, notification preferences, and website settings."
    },
  ];

  return (
    <div className="h-screen w-screen font-worksans flex flex-col justify-between bg-purple-50 p-8">
      <div className="flex-1 flex justify-center items-center">
        <div className="mx-auto h-[calc(100vh-100px)] flex bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-10xl">

          {/* sidebar */}
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

              {/* main */}
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

            {/* support content */}
            <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Support Center</h2>
              </div>

              {/* tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`py-2 px-4 text-sm font-medium ${activeTab === 'contact' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('contact')}
                >
                  Contact Us
                </button>
                <button
                  className={`py-2 px-4 text-sm font-medium ${activeTab === 'faq' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('faq')}
                >
                  FAQ
                </button>
              </div>

              {/* contact form */}
              {activeTab === 'contact' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="How can we help you?"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          placeholder="Please describe your issue in detail..."
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium"
                      >
                        Submit Request
                      </button>
                    </form>
                  </div>
                  <div>
                  </div>
                </div>
              )}

              {/*faq*/}
              {activeTab === 'faq' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <details className="group">
                          <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <span className="font-medium">{faq.question}</span>
                            <FaChevronDown className="text-gray-500 group-open:rotate-180 transition-transform" />
                          </summary>
                          <div className="p-4 border-t border-gray-200">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                    <p className="text-center">
                      <span className="block font-medium text-gray-800 mb-2">Didn't find what you were looking for?</span>
                      <button 
                        onClick={() => setActiveTab('contact')}
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Contact Us!
                      </button>
                    </p>
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

export default SupportPage;