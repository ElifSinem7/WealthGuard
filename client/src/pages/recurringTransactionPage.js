import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RecurringTransactions() {
  const [recurrings, setRecurrings] = useState([]);

  useEffect(() => {
    // Geçici mock veri veya backendden veri çekilecek yer
    axios.get('/api/recurring-transactions')
      .then(res => setRecurrings(res.data))
      .catch(err => console.error('Fetch failed:', err));
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Recurring Transactions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Description</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Type</th>
              <th className="p-2">Category</th>
              <th className="p-2">Day</th>
              <th className="p-2">Next Run</th>
              <th className="p-2">Recurrence</th>
            </tr>
          </thead>
          <tbody>
            {recurrings.length > 0 ? (
              recurrings.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">₺{item.amount}</td>
                  <td className="p-2 capitalize">{item.type}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.day_of_month}</td>
                  <td className="p-2">{item.next_run}</td>
                  <td className="p-2">{item.recurrence}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 text-center" colSpan="7">No recurring transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
