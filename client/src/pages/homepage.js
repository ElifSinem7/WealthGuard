import { Link } from "react-router-dom";
import { useThemeLanguage } from "./ThemeLanguageContext";

export default function HomePage() {
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

      {/* Main Section */}
      <section 
        className="flex flex-col md:flex-row items-center justify-center w-full px-20 mx-auto h-[calc(100vh-100px)] gap-20 overflow-hidden"
        style={{ backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white" }}
      >
        <div className="w-full md:w-1/2 flex justify-end">
          <img
            src="/main.png"
            alt="WealthGuard Illustration"
            className="max-w-[700px] w-full"
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left flex justify-start">
          <h1 
            className="text-[70px] font-bold italic leading-snug"
            style={{ color: theme === "dark" ? "var(--text-main)" : "rgb(31, 41, 55)" }}
          >
            Protection <br /> with precision, <br /> every decision.
          </h1>
        </div>
      </section>

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