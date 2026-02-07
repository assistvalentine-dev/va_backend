import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FreeSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem('userId');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">

        {/* Celebration Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-romantic-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Congratulations, Blinder! ✨
        </h1>

        <p className="text-xl text-gray-300 mb-8">
          You are among the first 10 — your matching is completely FREE!
        </p>

        {/* What Happens Next */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 text-left space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              What Happens Next?
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-romantic-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Profile Review
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Our team will review your details carefully.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-romantic-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Expert Matching
                  </h3>
                  <p className="text-gray-400 text-sm">
                    You’ll be matched with a compatible partner.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-romantic-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Get Notified
                  </h3>
                  <p className="text-gray-400 text-sm">
                    You’ll hear from us within 1–2 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <strong>Expected Matching Time:</strong> 1–2 business days
            </p>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Need help? Email us at{' '}
              <a 
                href="mailto:assistvalentine@gmail.com"
                className="text-romantic-400 hover:underline"
              >
                assistvalentine@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
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

export default FreeSuccess;
