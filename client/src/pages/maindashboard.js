import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "../components/ui/button";
import { FiSettings, FiTrendingUp, FiClock, FiDollarSign, FiRefreshCcw, FiHelpCircle, FiSearch, FiBell, FiLogOut } from "react-icons/fi";


function Navbar({ user }) {
  return (
    <div>
      <div className="flex items-center justify-between bg-white p-4 rounded-xl">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold">{user.name || ""}</h3>
          <p className="text-xs text-gray-500">{user.username || ""}</p>
        </div>
        <div className="flex items-center gap-4">
          <FiSearch className="text-gray-600 text-lg cursor-pointer" />
          <FiBell className="text-gray-600 text-lg cursor-pointer" />
        </div>
      </div>
      <hr className="border-gray-200 my-2" />
    </div>
  );
}

function Sidebar({ onLogout }) {
  return (
    <div className="min-h-screen flex">
    <aside className="w-64 bg-white p-4 rounded-2xl shadow-md min-h-screen flex flex-col justify-between">
      <div>
        <Link to="/maindashboard">
          <h1 className="flex items-center text-2xl italic font-bold text-gray-900">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 object-cover" />
            WealthGuard
          </h1>
        </Link>

        <hr className="border-gray-200 my-2" />

        <h3 className="text-xs text-gray-400 uppercase mb-2">Main</h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 text-purple-600 font-medium bg-purple-100 p-2 rounded-lg">
            <FiTrendingUp /> Dashboard
          </li>
          <li className="flex items-center gap-3 text-gray-500 p-2">
            <FiClock /> Transactions
          </li>
          <li className="flex items-center gap-3 text-gray-500 p-2">
            <FiDollarSign /> Payments
          </li>
          <li className="flex items-center gap-3 text-gray-500 p-2">
            <FiRefreshCcw /> Exchange
          </li>
        </ul>

        <hr className="border-gray-200 my-2" />

        <h3 className="text-xs text-gray-400 uppercase mt-6 mb-2">Others</h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 text-gray-500 p-2">
            <FiSettings /> Settings
          </li>
          <li className="flex items-center gap-3 text-gray-500 p-2">
            <FiHelpCircle /> Support
          </li>
        </ul>
      </div>

      {/*logout*/}
      <button
        onClick={onLogout}
        className="flex items-center gap-3 text-purple-500 font-medium p-2 rounded-lg hover:bg-purple-100 transition mt-4"
      >
        <FiLogOut /> LogOut
      </button>
    </aside>
    </div>
  );
}

function handleLogout() {
  console.log("Log Out Successful!");
  // homepage
}
<Sidebar onLogout={handleLogout} />

function Dashboard() {
  const [user, setUser] = useState({ name: "", username: "" });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setUser({ name: "user", username: "username" });

    setTransactions([
      { name: "a", amount: 25 },
      { name: "b", amount: -84 },
      { name: "c", amount: 900 },
    ]);
  }, []);

  const data = transactions.map((t, index) => ({
    name: `T${index + 1}`,
    amount: t.amount,
  }));

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 ml-6">
        <Navbar user={user} />

        <div className="grid grid-cols-3 gap-6 mt-6">
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">Budget Overview</h3>
              <p className="text-xl font-bold">Income: ${transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0)}</p>
              <p className="text-sm text-gray-500">Scheduled: $95,200.00</p>
              <p className="text-sm text-red-500">Expenses: ${transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold">Spending Summary</h3>
              <p className="text-xl font-bold">${transactions.reduce((acc, t) => acc + Math.abs(t.amount), 0)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-4">Transaction Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
