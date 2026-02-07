import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear sessionStorage
    sessionStorage.removeItem('userId');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Payment Successful! 🎉
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Thank you for joining Blind Dating
        </p>

        {/* Next Steps */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 text-left space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-romantic-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Review Your Profile</h3>
                  <p className="text-gray-400 text-sm">
                    Our team will review your submitted information
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-romantic-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Expert Matching</h3>
                  <p className="text-gray-400 text-sm">
                    Our experts will carefully match you with compatible partners based on your preferences
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-romantic-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Get Notified</h3>
                  <p className="text-gray-400 text-sm">
                    You'll receive an email or phone call within 1–2 business days with your match details
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expected Timeline */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <strong>Expected Matching Time:</strong> 1–2 business days
            </p>
            <p className="text-blue-300 text-sm mt-2">
              We'll contact you via email or phone once we find your perfect match!
            </p>
          </div>

          {/* Contact Info */}
          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Have questions? Contact us at{' '}
              <a href="mailto:assistvalentine@gmail.com" className="text-romantic-400 hover:underline">
                assistvalentine@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;


