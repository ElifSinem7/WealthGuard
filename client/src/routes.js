import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import About from "./pages/about";
import ContactUs from "./pages/contactus";
import Support from "./pages/support";
import FAQ from "./pages/faq";
import Payments from "./pages/payments";
import PaMod from "./pages/paymod";
import Exchange from "./pages/exchange";
import Settings from "./pages/settings";
import MainDashboard from "./pages/maindashboard";
import Modal from "./pages/AddTransactionModal";
import RecurringTransactions from "./pages/recurringTransactionPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/support" element={<Support />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/exchange" element={<Exchange />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/paymod" element={<PaMod />} />
      <Route path="/AddTransactionModal" element={<Modal />} />
      <Route path="/maindashboard" element={<MainDashboard />} />
      <Route path="/recurringTransactionPage" element={<RecurringTransactions />} />
    </Routes>
  );
}

export default AppRoutes;