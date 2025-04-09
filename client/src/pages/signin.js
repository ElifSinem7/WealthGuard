import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col font-worksans">
      <nav className="w-full px-10 py-4 flex justify-between items-center bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-24 h-24 object-cover" />
          <Link to="/" className="text-5xl italic font-bold text-gray-900">
            WealthGuard
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/signin" className="text-xl font-semibold text-gray-700 hover:text-gray-900">
            Sign In
          </Link>
          <Link to="/signup" className="px-6 py-3 text-xl font-semibold text-gray-900 rounded-full hover:opacity-80" style={{ backgroundColor: "#A6B3A4" }}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* signin */}
      <div className="flex items-center justify-center h-screen w-screen ">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px] border-4 border-gray-500">
          <h2 className="text-xl font-semibold text-center">
            Sign in to <span className="font-bold">WealthGuard</span>
          </h2>
          <p className="text-sm text-gray-600 text-center">
            Welcome back! Please sign in to continue.
          </p>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-sm font-medium">E-mail address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <button type="submit" className="w-full bg-gray-400 text-black py-2 rounded-lg mt-4">
                Continue
              </button>
            </form>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Don’t have an account?</span>
            <Link to="/signup" className="font-bold text-black ml-1">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <footer className="w-full bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-gray-700">
    
    {/*about*/}
    <div className="text-center md:text-left max-w-sm mb-4 md:mb-0">
      <h2 className="text-2xl font-semibold text-gray-900">WealthGuard</h2>
      <p className="text-sm mt-2">
        WealthGuard helps you manage your budget, track expenses, and achieve your financial goals with smart insights and automation.
      </p>
    </div>

    {/*aboutinfo*/}
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
      <ul className="text-sm space-y-1 mt-2">
        <li> <Link to ="/about" className="hover:text-gray-900">About</Link></li> 
        <li> <Link to ="/contactus"className="hover:text-gray-900">Contact Us</Link></li>
        <li> <Link to ="/support" className="hover:text-gray-900">Support</Link></li>
      </ul>
    </div>

    {/*copyright*/}
    <div className="flex items-center h-full">
      <p className="text-xs text-gray-500">© 2025 WealthGuard. All rights reserved.</p>
    </div>

        </div>
      </footer>
    </div>
  );
}