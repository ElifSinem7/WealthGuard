import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';

const AddTransactionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date(),
    note: '',
  });
  
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date(),
        note: '',
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
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // kategori
  const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Health', 'Education', 'Housing', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Rental', 'Other']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, 
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({
      ...formData,
      type: newType,
      category: ''
    });
  };

  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      date: new Date(e.target.value)
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Transaction name is required';
    }
    
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const newTransaction = {
      id: Date.now(), 
      name: formData.name,
      category: formData.category,
      amount: formData.type === 'expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)),
      date: formData.date.toISOString().split('T')[0],
      type: formData.type,
      note: formData.note,
      icon: formData.category.toLowerCase() 
    };
    
    onSave(newTransaction);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in"
      >
        {/* header*/}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">Add Transaction</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>
        
        {/* form */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* transaction type */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer ${formData.type === 'expense' ? 'bg-red-50 border-red-300 text-red-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="type" 
                    value="expense" 
                    checked={formData.type === 'expense'} 
                    onChange={handleTypeChange}
                    className="sr-only"
                  />
                  <span>Expense</span>
                </label>
                <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer ${formData.type === 'income' ? 'bg-green-50 border-green-300 text-green-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="type" 
                    value="income" 
                    checked={formData.type === 'income'} 
                    onChange={handleTypeChange}
                    className="sr-only"
                  />
                  <span>Income</span>
                </label>
              </div>
            </div>
            
            {/*name*/}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Name
              </label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Grocery Shopping, Salary"
                className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            {/* amount */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input 
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full p-3 pl-8 border rounded-lg ${errors.amount ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
              {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
            </div>
            
            {/*kategori*/}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg appearance-none bg-white ${errors.category ? 'border-red-300' : 'border-gray-200'}`}
              >
                <option value="">Select a category</option>
                {categories[formData.type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>
            
            {/* date */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <input 
                  type="date"
                  name="date"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {/* note */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (Optional)
              </label>
              <textarea 
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Add additional details..."
                rows="3"
                className="w-full p-3 border border-gray-200 rounded-lg resize-none"
              ></textarea>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
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