import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import About from "./pages/about";
import ContactUs from "./pages/contactus";
import Support from "./pages/support";
import MainDashboard from "./pages/maindashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/support" element={<Support />} />
        <Route path="/maindashboard" element={<MainDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
