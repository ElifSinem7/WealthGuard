import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components//ui/button";

export default function HomePage() {
    return (
      <div className="h-screen w-screen bg-white flex flex-col font-worksans">
        {/* headbar */}
        <nav className="w-full px-10 py-4 flex justify-between items-center bg-gray-100 border-b">
          {/* logo */}
          <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-24 h-24 object-cover"
            />
           
           <Link to="/" className="text-5xl italic font-bold text-gray-900">
                WealthGuard
            </Link>


          </div>
          
           {/* sag */}
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
  
        {/* anakisim */}
        <section className="flex flex-col md:flex-row items-center justify-center w-full px-20 mx-auto min-h-[calc(100vh-100px)] gap-20">
          {/*gorsel */}
          <div className="w-full md:w-1/2 flex justify-end">
            <img 
              src="/main.jpg" 
              alt="WealthGuard Illustration" 
              className="max-w-[700px] w-full object-contain rounded-lg"
            />
          </div>
  
          {/*slogan */}
          <div className="w-full md:w-1/2 text-center md:text-left flex justify-start">
            <h1 className="text-[70px] font-bold italic text-gray-800 leading-snug">
              Protection <br /> with precision, <br /> every decision.
            </h1>
          </div>
        </section>
  
        {/*altbar*/}
        <footer className="w-full bg-gray-100 border-t border-gray-300 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-gray-700">
    
    {/*aciklama */}
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
        <li><a href="#" className="hover:text-gray-900">About</a></li>
        <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
        <li><a href="#" className="hover:text-gray-900">Support</a></li>
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
  