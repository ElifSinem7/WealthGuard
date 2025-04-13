import { Link } from "react-router-dom";
import { useState } from "react";

export default function Support() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Support Request:", { email, message });
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

      {/* support */}
      <div className="flex-grow flex items-center justify-center bg-gray-50 p-4 h-screen w-screen">
        <div className="bg-white shadow-lg rounded-3xl p-6 w-full max-w-lg border-4 border-gray-500">
          <h2 className="text-2xl font-bold text-center text-gray-900">Need Help? Contact Support</h2>
          <p className="text-sm text-gray-600 text-center mt-2">
            Please fill in the form below. <br/ > We will get back to you as soon as possible.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium">E-mail Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
                onInvalid={(e) => e.target.setCustomValidity(" ")} 
                //bu mesaj default olarak verılıyordu o yuzden bız bunu manual olarak ayarlamak ıstedık, 
                // bunu koyarsak manual olarak ayarlamıs oluyoruz ehger koymazsak bu otomaıtık olarak kendı kendıne uyarı verıyor
                onInput={(e) => e.target.setCustomValidity("")}
              
              />
            </div>

            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg h-32 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-400 text-black py-2 rounded-lg hover:opacity-80"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* bottombar*/}
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
              <li>
                <Link to="/about" className="hover:text-gray-900">About</Link>
              </li>
              <li>
                <Link to="/contactus" className="hover:text-gray-900">Contact Us</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-gray-900">Support</Link>
              </li>
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
