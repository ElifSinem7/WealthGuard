import PaymentService from '../services/payment.service';
import React, { useState } from "react";
import { FaTimes, FaCalendarAlt, FaDollarSign, FaTag } from "react-icons/fa";
import { useThemeLanguage } from "./ThemeLanguageContext";

const PaMod = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Utility");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("1");

  // Get theme context
  const { 
    theme, 
    colorTheme,
    fontSize 
  } = useThemeLanguage();

  const categories = [
    "Housing", "Utility", "Insurance", "Entertainment", "Health",
    "Transportation", "Education", "Subscription", "Loan", "Other"
  ];

  const dates = Array.from({ length: 31 }, (_, i) => i + 1);


  const resetForm = () => {
    setName("");
    setCategory("Utility");
    setAmount("");
    setDueDate("1");
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "housing": return "home";
      case "utility": return "utility";
      case "insurance": return "shield";
      case "entertainment": return "video";
      case "health": return "health";
      case "transportation": return "car";
      case "education": return "book";
      case "subscription": return "refresh";
      case "loan": return "money";
      default: return "tag";
    }
  };

  // Method to get the appropriate color class based on current theme
  const getThemeClass = (purpleClass, blueClass) => {
    return colorTheme === 'blue' ? blueClass : purpleClass;
  };

  // Dynamic classes based on theme
  const bgModalClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textMainClass = theme === "dark" ? "text-white" : "text-gray-800";
  const textSecondaryClass = theme === "dark" ? "text-gray-300" : "text-gray-500";
  const textLabelClass = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-100";
  const inputBgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const inputBorderClass = theme === "dark" ? "border-gray-600" : "border-gray-200";
  const buttonHoverClass = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const cancelBtnTextClass = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const cancelBtnBorderClass = theme === "dark" ? "border-gray-600" : "border-gray-300";

  // Apply font size class based on settings
  const fontSizeClass = 
    fontSize === "small" ? "text-sm" : 
    fontSize === "large" ? "text-lg" : 
    "text-base";

  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Tüm gerekli alanların doldurulduğunu kontrol et
    if (!name || !amount || !dueDate) {
      alert("Lütfen tüm zorunlu alanları doldurun");
      return;
    }
  
    // Backend'in beklediği formatta bir ödeme nesnesi oluştur
    const newPayment = {
      name,
      category,
      amount: parseFloat(amount),
      dueDate: parseInt(dueDate),
      paid: false,
      icon: getCategoryIcon(category),
    };
  
    // Daha iyi hata ayıklama için konsola yazdır
    console.log("Gönderilecek ödeme verisi:", newPayment);
  
    // Asenkron işlemi try-catch bloğu içinde izole et
    try {
      onSave(newPayment);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Ödeme kaydedilirken hata oluştu:", error);
      alert("Ödeme kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${bgModalClass} rounded-lg shadow-xl w-full max-w-md ${fontSizeClass}`}>
        <div className={`flex justify-between items-center p-5 border-b ${borderClass}`}>
          <h2 className={`text-xl font-bold ${textMainClass}`}>Add Monthly Payment</h2>
          <button onClick={onClose} className={`${textSecondaryClass} hover:${textMainClass}`}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {/* Name */}
          <div className="mb-4">
            <label className={`block ${textLabelClass} text-sm font-medium mb-2`}>Payment Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border ${inputBorderClass} rounded-md ${inputBgClass} ${textMainClass} focus:ring-2 ${getThemeClass('focus:ring-purple-500', 'focus:ring-blue-500')}`}
              placeholder="e.g. Rent, Netflix, Electric Bill"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className={`block ${textLabelClass} text-sm font-medium mb-2`}>Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 border ${inputBorderClass} rounded-md ${inputBgClass} ${textMainClass} focus:ring-2 ${getThemeClass('focus:ring-purple-500', 'focus:ring-blue-500')} appearance-none`}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
              <FaTag className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass} pointer-events-none`} />
            </div>
          </div>

          {/* Amount & Due Date */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block ${textLabelClass} text-sm font-medium mb-2`}>Amount ($) *</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-3 py-2 border ${inputBorderClass} rounded-md ${inputBgClass} ${textMainClass} focus:ring-2 ${getThemeClass('focus:ring-purple-500', 'focus:ring-blue-500')}`}
                  placeholder="0.00"
                  required
                />
                <FaDollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`} />
              </div>
            </div>

            <div>
              <label className={`block ${textLabelClass} text-sm font-medium mb-2`}>Due Date *</label>
              <div className="relative">
                <select
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full pl-8 pr-3 py-2 border ${inputBorderClass} rounded-md ${inputBgClass} ${textMainClass} focus:ring-2 ${getThemeClass('focus:ring-purple-500', 'focus:ring-blue-500')} appearance-none`}
                  required
                >
                  {dates.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <FaCalendarAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`} />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className={`px-4 py-2 border ${cancelBtnBorderClass} rounded-md ${cancelBtnTextClass} ${buttonHoverClass}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 ${getThemeClass('bg-purple-500 hover:bg-purple-600', 'bg-blue-500 hover:bg-blue-600')} text-white rounded-md`}
            >
              Add Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaMod;