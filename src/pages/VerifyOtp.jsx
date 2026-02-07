import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../utils/api";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;
  const userId = state?.userId;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  const [timer, setTimer] = useState(60); // 60-sec cooldown
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerify = async () => {
    if (loading) return; // ✅ PREVENT DOUBLE CLICK

    if (!otp || otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await verifyOtp({ email, otp });

      if (res.success) {
        toast.success("Email verified successfully 🎉");

        if (res.data.paymentStatus === "PAID") {
          navigate("/success");
        } else if (res.data.paymentStatus === "FREE") {
          navigate("/free-success");
        } else {
          navigate("/payment");
        }
      } else {
        toast.error(res.message);
        setMessage(res.message);
      }
    } catch {
      toast.error("Verification failed. Try again.");
      setMessage("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return; // ✅ PREVENT DOUBLE CLICK

    setResending(true);
    setMessage("");

    try {
      await resendOtp({ email });
      toast.success("New OTP sent to your email 📩");

      setTimer(60);      // restart timer
      setCanResend(false);
    } catch (error) {
      toast.error("Failed to resend OTP.");
      setMessage("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">

      {/* BLOCKING OVERLAY WHILE VERIFYING */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-white font-semibold">Verifying OTP...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait</p>
          </div>
        </div>
      )}

      <div className="bg-gray-800 p-8 rounded-xl text-center w-96">
        <h2 className="text-xl text-white mb-4">Verify Your Email</h2>
        <p className="text-gray-300 mb-4">OTP sent to: {email}</p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter 6-digit OTP"
          className="input-field mb-4 w-full text-center tracking-widest text-lg"
          disabled={loading}
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="btn-primary w-full mb-2 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {canResend ? (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-romantic-500 mt-2 underline disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        ) : (
          <p className="text-gray-400 mt-2">
            Resend available in {timer}s
          </p>
        )}

        {message && <p className="text-red-400 mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyOtp;
