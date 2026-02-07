import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import UserForm from './pages/UserForm';
import Payment from './pages/Payment';
import Success from './pages/Success';
import VerifyOtp from './pages/VerifyOtp';
import ScrollToTop from './hooks/ScrollToTop.jsx';
import FreeSuccess from './pages/FreeSuccess.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/form" element={<UserForm />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/free-success" element={<FreeSuccess />} />
      </Routes>
    </div>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;


