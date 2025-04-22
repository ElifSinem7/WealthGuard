import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data && response.data.user) {
        // Kullanıcıyı localStorage'a kaydet
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/maindashboard");
      } else {
        setError("Geçersiz giriş bilgileri");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message); // Backend'den gelen mesajı göster
      } else {
        setError("Giriş yaparken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
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
      </nav>

      <div className="flex items-center justify-center flex-1">
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
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full ${loading ? 'bg-gray-300' : 'bg-gray-400'} text-black py-2 rounded-lg mt-4`}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
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
          <div className="text-center md:text-left max-w-sm mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold text-gray-900">WealthGuard</h2>
            <p className="text-sm mt-2">
              WealthGuard helps you manage your budget, track expenses, and achieve your financial goals with smart insights and automation.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="text-sm space-y-1 mt-2">
              <li><Link to="/about" className="hover:text-gray-900">About</Link></li>
              <li><Link to="/contactus" className="hover:text-gray-900">Contact Us</Link></li>
              <li><Link to="/support" className="hover:text-gray-900">Support</Link></li>
            </ul>
          </div>

          <div className="flex items-center h-full">
            <p className="text-xs text-gray-500">© 2025 WealthGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
