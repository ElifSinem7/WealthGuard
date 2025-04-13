import { Link } from "react-router-dom";

export default function About() {
    return (
      <div className="h-screen w-screen bg-white flex flex-col font-worksans">
        {/* headbar */}
        <nav className="w-full px-10 py-4 flex justify-between items-center bg-gray-50 border-b">
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
          
           {/* right */}
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
  
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-50 px-6 py-12"
     >
      <div className="max-w-3xl bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          This personal finance and budget tracking application is designed to help individuals 
          gain better control over their finances. Users can easily track their income, 
          manage recurring expenses, and categorize their daily spending to stay within their budget.   
          The app offers insightful tools that analyze spending patterns and provide 
          recommendations for saving money, helping users make more informed financial decisions.
          Additionally, the application supports multi-currency transactions, allowing users 
          to track expenses in different currencies with real-time exchange rate data.      
          Users can set financial goals, track their progress, and receive timely reminders 
          or alerts to ensure they stay on track with their budgets.
          With its user-friendly interface and helpful features, the web app aims to promote 
          financial wellness and improve money management for people of all backgrounds.
        </p>
      </div>
    </div>

  
        {/*bottombar*/}
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
  