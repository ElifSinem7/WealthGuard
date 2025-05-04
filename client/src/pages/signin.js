import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useThemeLanguage } from "./ThemeLanguageContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useThemeLanguage();

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

  // Apply theme-based styles
  const themeStyles = {
    backgroundColor: theme === "dark" ? "var(--bg-main)" : "white",
    color: theme === "dark" ? "var(--text-main)" : "inherit",
  };

  const cardStyles = {
    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
    borderColor: theme === "dark" ? "var(--border-color)" : "gray",
    color: theme === "dark" ? "var(--text-main)" : "inherit",
  };

  const buttonStyles = {
    backgroundColor: theme === "dark" ? "#555" : "#A6B3A4",
    color: theme === "dark" ? "white" : "black",
  };

  return (
    <div className="h-screen w-screen flex flex-col font-worksans" style={themeStyles}>
      {/* Navbar */}
      <nav 
        className="w-full px-10 py-4 flex justify-between items-center border-b"
        style={{ 
          backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "var(--bg-secondary)",
          borderColor: theme === "dark" ? "var(--border-color)" : "var(--border-color)"
        }}
      >
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-24 h-24 object-cover" />
          <Link to="/" className="text-5xl italic font-bold" style={{ color: theme === "dark" ? "var(--text-main)" : "rgb(17, 24, 39)" }}>
            WealthGuard
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            to="/signin"
            className="text-xl font-semibold hover:opacity-80"
            style={{ color: theme === "dark" ? "var(--text-main)" : "rgb(55, 65, 81)" }}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 text-xl font-semibold rounded-full hover:opacity-80"
            style={buttonStyles}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center flex-1" style={{ backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "rgb(249, 250, 251)" }}>
        <div 
          className="rounded-3xl shadow-lg p-8 w-[400px] border-4"
          style={cardStyles}
        >
          <h2 className="text-xl font-semibold text-center" style={{ color: theme === "dark" ? "var(--text-main)" : "inherit" }}>
            Sign in to <span className="font-bold">WealthGuard</span>
          </h2>
          <p className="text-sm text-center" style={{ color: theme === "dark" ? "var(--text-secondary)" : "rgb(75, 85, 99)" }}>
            Welcome back! Please sign in to continue.
          </p>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-sm font-medium" style={{ color: theme === "dark" ? "var(--text-main)" : "inherit" }}>
                E-mail address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-lg"
                style={{ 
                  backgroundColor: theme === "dark" ? "#333" : "white",
                  color: theme === "dark" ? "white" : "black",
                  borderColor: theme === "dark" ? "#555" : "rgb(209, 213, 219)"
                }}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: theme === "dark" ? "var(--text-main)" : "inherit" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
                style={{ 
                  backgroundColor: theme === "dark" ? "#333" : "white",
                  color: theme === "dark" ? "white" : "black",
                  borderColor: theme === "dark" ? "#555" : "rgb(209, 213, 219)"
                }}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg mt-4"
              style={{ 
                backgroundColor: loading ? (theme === "dark" ? "#444" : "rgb(209, 213, 219)") : (theme === "dark" ? "#555" : "rgb(156, 163, 175)"),
                color: theme === "dark" ? "white" : "black"
              }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span style={{ color: theme === "dark" ? "var(--text-secondary)" : "rgb(75, 85, 99)" }}>
              Don't have an account?
            </span>
            <Link to="/signup" className="font-bold ml-1" style={{ color: theme === "dark" ? "var(--text-main)" : "black" }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <footer 
        className="w-full border-t py-8"
        style={{ 
          backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "rgb(249, 250, 251)",
          borderColor: theme === "dark" ? "var(--border-color)" : "rgb(243, 244, 246)" 
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <div className="text-center md:text-left max-w-sm mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold" style={{ color: theme === "dark" ? "var(--text-main)" : "rgb(17, 24, 39)" }}>
              WealthGuard
            </h2>
            <p className="text-sm mt-2" style={{ color: theme === "dark" ? "var(--text-secondary)" : "rgb(75, 85, 99)" }}>
              WealthGuard helps you manage your budget, track expenses, and achieve your financial goals with smart insights and automation.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold" style={{ color: theme === "dark" ? "var(--text-main)" : "rgb(17, 24, 39)" }}>
              Quick Links
            </h3>
            <ul className="text-sm space-y-1 mt-2">
              <li>
                <Link to="/about" className="hover:opacity-80" style={{ color: theme === "dark" ? "var(--text-secondary)" : "rgb(75, 85, 99)" }}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/contactus" className="hover:opacity-80" style={{ color: theme === "dark" ? "var(--text-secondary)" : "rgb(75, 85, 99)" }}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:opacity-80" style={{ color: theme === "dark" ? "var(--text-secondary)" : "rgb(75, 85, 99)" }}>
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center h-full">
            <p style={{ color: theme === "dark" ? "#888" : "rgb(107, 114, 128)", fontSize: "0.75rem" }}>
              © 2025 WealthGuard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}