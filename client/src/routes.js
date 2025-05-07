import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/homepage';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import About from './pages/about';
import ContactUs from './pages/contactus';
import Support from './pages/support';
import MainDashboard from './pages/maindashboard';
import RecurringTransactionPage from './pages/recurringTransactionPage';
import Payments from './pages/payments';
import Exchange from './pages/exchange';
import Settings from './pages/settings';
import FAQ from './pages/faq';

const AppRoutes = () => {
  return (
    <Routes>
      {/* erisime acik olanlar */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/support" element={<Support />} />
      
      {/* korumali sayfalar*/}
      <Route path="/maindashboard" element={
        <ProtectedRoute>
          <MainDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/recurringtransactionpage" element={
        <ProtectedRoute>
          <RecurringTransactionPage />
        </ProtectedRoute>
      } />
      
      <Route path="/payments" element={
        <ProtectedRoute>
          <Payments />
        </ProtectedRoute>
      } />
      
      <Route path="/exchange" element={
        <ProtectedRoute>
          <Exchange />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      <Route path="/faq" element={
        <ProtectedRoute>
          <FAQ />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={
  <ProtectedRoute>
    <Navigate to="/maindashboard" replace />
  </ProtectedRoute>
} />
    </Routes>
  );
};

export default AppRoutes;