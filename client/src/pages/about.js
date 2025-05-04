import { Link } from "react-router-dom";
import { useThemeLanguage } from "./ThemeLanguageContext";

export default function About() {
  const { theme } = useThemeLanguage();

  // Apply theme-based styles
  const themeStyles = {
    backgroundColor: theme === "dark" ? "var(--bg-main)" : "white",
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

      {/* Content */}
      <div 
        className="flex flex-col items-center justify-center flex-grow px-6 py-12"
        style={{ backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "rgb(249, 250, 251)" }}
      >
        <div 
          className="max-w-3xl p-8 rounded-2xl shadow-lg text-center"
          style={{ 
            backgroundColor: theme === "dark" ? "var(--bg-main)" : "white",
          }}
        >
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ color: theme === "dark" ? "var(--text-main)" : "rgb(17, 24, 39)" }}
          >
            About
          </h1>
          <p 
            className="text-lg leading-relaxed"
            style={{ color: theme === "dark" ? "var(--text-secondary)" : "rgb(75, 85, 99)" }}
          >
            This personal finance and budget tracking application is designed
            to help individuals gain better control over their finances. Users
            can easily track their income, manage recurring expenses, and
            categorize their daily spending to stay within their budget. The
            app offers insightful tools that analyze spending patterns and
            provide recommendations for saving money. Additionally, the
            application supports multi-currency transactions and financial goal
            tracking with reminders and alerts. With its user-friendly
            interface, the web app aims to promote financial wellness for
            everyone.
          </p>
        </div>
      </div>

      {/* Footer */}
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