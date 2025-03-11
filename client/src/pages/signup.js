import { Link } from "react-router-dom";
import { useState } from "react"; // useState'i ekledik
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false); // Şifreyi göster/gizle kontrolü için state

  return (
    <div className="h-screen w-screen bg-white flex flex-col font-worksans">
      {/* Navbar */}
      <nav className="w-full px-10 py-4 flex justify-between items-center bg-gray-100 border-b">
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
          <Link to="/signup" 
            className="px-6 py-3 text-xl font-semibold text-gray-900 rounded-full hover:opacity-80"
            style={{ backgroundColor: "#A6B3A4" }}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* SignUp Form */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px] border-4 border-gray-500">
          <h2 className="text-xl font-semibold text-center">Create your account</h2>
          <p className="text-sm text-gray-600 text-center">Welcome! Please fill in the details to get started.</p>

          {/* Google ile giriş */}
          <div className="flex justify-center mt-4">
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm">
              <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium">Google</span>
            </button>
          </div>

          {/* Bölücü çizgi */}
          <div className="flex items-center gap-2 my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-xs">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input type="text" name="firstName" className="w-full p-2 border border-gray-300 rounded-lg" required />
            </div>

            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input type="text" name="lastName" className="w-full p-2 border border-gray-300 rounded-lg" required />
            </div>

            <div>
              <label className="text-sm font-medium">E-mail Address</label>
              <input type="email" name="email" className="w-full p-2 border border-gray-300 rounded-lg" required />
            </div>

            {/* Password Input */}
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    className="w-full p-2 pr-10 border border-gray-300 rounded-lg"
    required
  />
  <button
    type="button"
    className="absolute right-3 top-1/2 transform -translate-y-1/2"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>
          </div>

          {/* Continue Butonu */}
          <button className="w-full bg-gray-400 text-black py-2 rounded-lg mt-4">
            Continue
          </button>

          {/* Alt Kısım */}
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>
            <Link to="/signin" className="font-bold text-black ml-1">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <div className="max-w-md">
            <h2 className="text-lg font-semibold text-gray-900">WealthGuard</h2>
            <p className="text-sm text-gray-600 mt-1">
              WealthGuard helps you manage your budget, track expenses, and achieve your financial goals with smart insights and automation.
            </p>
          </div>

          <div className="pl-10">
            <h3 className="text-md font-semibold text-gray-900">Info</h3>
            <ul className="text-sm text-gray-600 space-y-1 mt-1">
              <li>
                <Link to="/about" className="hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-gray-900">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-xs text-gray-500 text-center">
            © 2025 WealthGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}








/*
<3
*/