import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPaymentOrder, verifyPayment } from '../utils/api';

const Payment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const paymentAmount = import.meta.env.VITE_PAYMENT_AMOUNT ;
  const paymentGateway = import.meta.env.VITE_PAYMENT_GATEWAY ;

  useEffect(() => {
    // Get userId from sessionStorage
    const storedUserId = sessionStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/form');
      return;
    }
    setUserId(storedUserId);
    initializePayment();
  }, [navigate]);

  const initializePayment = async () => {
    const storedUserId = sessionStorage.getItem('userId');
    if (!storedUserId) return;

    setLoading(true);
    try {
      const response = await createPaymentOrder(storedUserId, paymentAmount);
      if (response.success) {
        setOrderData(response.data);
      } else {
        setError(response.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      setError(error.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = () => {
    if (!orderData || !userId) return;

    if (!window.Razorpay) {
      alert("Razorpay not loaded. Please refresh.");
      return;
    }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount * 100, // Convert to paise
      currency: orderData.currency,
      name: 'Blind Dating',
      description: 'Blind Dating Registration',
      order_id: orderData.orderId,
      handler: async function (response) {
        // Verify payment
        setLoading(true);
        try {
          const verifyResponse = await verifyPayment(userId, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyResponse.success) {
            navigate('/success');
          } else {
            setError('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          setError('Payment verification failed');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#ec4899',
      },
      modal: {
        ondismiss: function () {
          setError('Payment cancelled');
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleStripePayment = async () => {
    if (!orderData || !userId) return;

    // Load Stripe.js
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => processStripePayment();
      document.body.appendChild(script);
    } else {
      processStripePayment();
    }

    async function processStripePayment() {
      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      
      setLoading(true);
      try {
        const result = await stripe.confirmCardPayment(orderData.clientSecret, {
          payment_method: {
            card: {
              // Card details would be collected via Stripe Elements
              // For demo, we'll use a test flow
            },
          },
        });

        if (result.error) {
          setError(result.error.message);
        } else {
          // Verify payment
          const verifyResponse = await verifyPayment(userId, {
            paymentIntentId: result.paymentIntent.id,
          });

          if (verifyResponse.success) {
            navigate('/success');
          } else {
            setError('Payment verification failed');
          }
        }
      } catch (error) {
        console.error('Stripe payment error:', error);
        setError('Payment processing failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePayment = () => {
    if (paymentGateway === 'razorpay') {
      handleRazorpayPayment();
    } else if (paymentGateway === 'stripe') {
      handleStripePayment();
    }
  };

  // Load Razorpay script if using Razorpay
  useEffect(() => {
    if (paymentGateway === 'razorpay' && orderData) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [orderData, paymentGateway]);

  if (loading && !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-romantic-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Complete Your Payment</h1>
          <p className="text-gray-400">Secure payment to start your journey</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Payment Summary */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Registration Fee</span>
                  <span className="font-semibold">
                    {paymentGateway === 'razorpay' ? '₹' : '$'}
                    {paymentAmount}
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between text-white text-lg font-bold">
                  <span>Total Amount</span>
                  <span>
                    {paymentGateway === 'razorpay' ? '₹' : '$'}
                    {paymentAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Gateway Info */}
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Secure Payment:</strong> Your payment is processed securely through{' '}
                {paymentGateway === 'razorpay' ? 'Razorpay' : 'Stripe'}. We do not store your payment details.
              </p>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={loading || !orderData}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay ${paymentGateway === 'razorpay' ? '₹' : '$'}${paymentAmount}`}
            </button>

            <p className="text-center text-gray-500 text-sm">
              By proceeding, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;


