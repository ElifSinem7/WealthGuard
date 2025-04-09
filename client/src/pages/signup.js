import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Form inputlarını güncelle
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        navigate("/signin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col font-worksans">
      {/* headbar */}
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
          <Link
            to="/signup"
            className="px-6 py-3 text-xl font-semibold text-gray-900 rounded-full hover:opacity-80"
            style={{ backgroundColor: "#A6B3A4" }}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* signup form*/}
      <div className="h-screen w-screen flex items-center justify-center ">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px] border-4 border-gray-500">
          <h2 className="text-xl font-semibold text-center">Create your account</h2>
          <p className="text-sm text-gray-600 text-center">Welcome! Please fill in the details to get started.</p>

          {/*form*/}
          <form onSubmit={handleSubmit} className="space-y-3 mt-4">
            {/*full name*/}
            <div>
              <label className="text-sm font-medium block mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/*mail */}
            <div>
              <label className="text-sm font-medium block mb-1">E-mail Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/*password*/}
            <div>
              <label className="text-sm font-medium block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
            {/*continue*/}
              <Link to="/signin">
              <button type="button" className="w-full bg-gray-400 text-black py-2 rounded-lg mt-4">
                Continue
              </button>
            </Link>
          </form>

          {/*bottom*/}
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>
            <Link to="/signin" className="font-bold text-black ml-1">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/*bottombar*/}
      <footer className="w-full bg-gray-20 border-t border-gray-100 py-8">
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
