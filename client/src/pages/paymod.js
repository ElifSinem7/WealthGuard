import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaDollarSign, FaTag } from 'react-icons/fa';

const PaMod = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Utility');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('1');
  
  // kategoriler
  const categories = [
    'Housing',
    'Utility',
    'Insurance',
    'Entertainment',
    'Health',
    'Transportation',
    'Education',
    'Subscription',
    'Loan',
    'Other'
  ];
  
  //dates
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !amount || !dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    //new payments
    const newPayment = {
      id: Date.now(), 
      name,
      category,
      amount: parseFloat(amount),
      dueDate: parseInt(dueDate),
      paid: false,
      icon: getCategoryIcon(category),
    };
    
    onSave(newPayment);
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setName('');
    setCategory('Utility');
    setAmount('');
    setDueDate('1');
  };
  
  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'housing': return 'home';
      case 'utility': return 'utility';
      case 'insurance': return 'shield';
      case 'entertainment': return 'video';
      case 'health': return 'health';
      case 'transportation': return 'car';
      case 'education': return 'book';
      case 'subscription': return 'refresh';
      case 'loan': return 'money';
      default: return 'tag';
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Add Monthly Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Payment Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g. Rent, Netflix, Electric Bill"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
              <FaTag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Amount ($) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01" 
                  min="0"
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                  required
                />
                <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Due Date *
              </label>
              <div className="relative">
                <select
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  required
                >
                  {dates.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
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