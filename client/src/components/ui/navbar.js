import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <ul className="flex space-x-4 p-4 bg-gray-800 text-white">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/signin">Sign In</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contactus">Contact Us</Link></li>
        <li><Link to="/support">Support</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
