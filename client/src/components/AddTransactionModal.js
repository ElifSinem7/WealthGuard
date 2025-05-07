import TransactionService from '../services/transaction.service';
import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaCalendarAlt } from "react-icons/fa";
import { useThemeLanguage } from "./ThemeLanguageContext";

const AddTransactionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date(),
    note: "",
  });

  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  
  // Get theme context
  const { theme, colorTheme } = useThemeLanguage();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date(),
        note: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const categories = {
    expense: [
      "Food",
      "Transport",
      "Shopping",
      "Entertainment",
      "Utilities",
      "Health",
      "Education",
      "Housing",
      "Other",
    ],
    income: ["Salary", "Freelance", "Investment", "Gift", "Rental", "Other"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      type: e.target.value,
      category: "",
    }));
  };

  const handleDateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      date: new Date(e.target.value),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Transaction name is required";
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0)
      newErrors.amount = "Please enter a valid amount";
    if (!formData.category) newErrors.category = "Please select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    const newTransaction = {
      name: formData.name,
      category: formData.category,
      amount: formData.type === "expense"
        ? -Math.abs(Number(formData.amount))
        : Math.abs(Number(formData.amount)),
      date: formData.date.toISOString().split("T")[0],
      type: formData.type,
      note: formData.note || "",
      icon: formData.category.toLowerCase(),
    };
  
    onSave(newTransaction);
    onClose();
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

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 ${theme === "dark" ? "bg-black/70" : "bg-black/50"} flex items-center justify-center z-50 p-4`}>
      <div ref={modalRef} className={`${bgCardClass} rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in`}>
        <div className={`p-5 border-b ${borderClass} flex justify-between items-center`}>
          <h2 className={`font-bold text-lg ${textMainClass}`}>Add Transaction</h2>
          <button onClick={onClose} className={`p-1 rounded-full hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
            <FaTimes className={textSecondaryClass} />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Transaction Type */}
            <div className="mb-5">
              <label className={`block text-sm font-medium ${textMainClass} mb-2`}>
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["expense", "income"].map((type) => (
                  <label
                    key={type}
                    className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer ${
                      formData.type === type
                        ? type === "expense"
                          ? theme === "dark" ? "bg-red-900 border-red-700 text-red-300" : "bg-red-50 border-red-300 text-red-600"
                          : theme === "dark" ? "bg-green-900 border-green-700 text-green-300" : "bg-green-50 border-green-300 text-green-600"
                        : `${inputBorderClass} ${textSecondaryClass} ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"}`
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleTypeChange}
                      className="sr-only"
                    />
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-5">
              <label className={`block text-sm font-medium ${textMainClass} mb-2`}>
                Transaction Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Grocery Shopping, Salary"
                className={`w-full p-3 border rounded-lg ${inputBgClass} ${
                  errors.name ? "border-red-300" : inputBorderClass
                } ${textMainClass}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Amount */}
            <div className="mb-5">
              <label className={`block text-sm font-medium ${textMainClass} mb-2`}>Amount</label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondaryClass}`}>$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full p-3 pl-8 border rounded-lg ${inputBgClass} ${
                    errors.amount ? "border-red-300" : inputBorderClass
                  } ${textMainClass}`}
                />
              </div>
              {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className={`block text-sm font-medium ${textMainClass} mb-2`}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${inputBgClass} ${
                  errors.category ? "border-red-300" : inputBorderClass
                } ${textMainClass}`}
              >
                <option value="">Select a category</option>
                {categories[formData.type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>

            {/* Date */}
            <div className="mb-5">
              <label className={`block text-sm font-medium ${textMainClass} mb-2`}>Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date.toISOString().split("T")[0]}
                  onChange={handleDateChange}
                  className={`w-full p-3 border ${inputBorderClass} rounded-lg ${inputBgClass} ${textMainClass}`}
                />
                <FaCalendarAlt className={`absolute right-3 top-1/2 -translate-y-1/2 ${textSecondaryClass}`} />
              </div>
            </div>

            {/* Note */}
            <div className="mb-6">
              <label className={`block text-sm font-medium ${textMainClass} mb-2`}>Note (Optional)</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Add additional details..."
                rows="3"
                className={`w-full p-3 border ${inputBorderClass} rounded-lg resize-none ${inputBgClass} ${textMainClass}`}
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3 px-4 border ${inputBorderClass} ${textMainClass} rounded-lg ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 py-3 px-4 ${getThemeClass('bg-purple-500 hover:bg-purple-600', 'bg-blue-500 hover:bg-blue-600')} text-white rounded-lg`}
              >
                Save Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;