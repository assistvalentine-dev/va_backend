import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/form');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 mt-8">

      {/* message */}
      <div className="fixed top-0 left-0 w-full bg-romantic-600 text-white py-2 flex justify-center items-center gap-4 z-50">
        <div className="animate-marquee whitespace-nowrap">
          🎉 Limited Time Offer! Early Blinders Special: First 10 Get Free Matching! Limited Time Offer! 🎉
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-romantic-400 via-romantic-500 to-romantic-600 bg-clip-text text-transparent animate-pulse">
          Blind Dating
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Where True Connections Begin Without Judgement
        </p>

        {/* Description */}
        <div className="mt-12 space-y-6 text-gray-400 max-w-2xl mx-auto">
          <p className="text-lg leading-relaxed">
            Experience dating like never before. No profiles to browse, no photos to judge. 
            Just authentic connections based on who you truly are.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-romantic-500 transition-all duration-300">
            <div className="w-12 h-12 bg-romantic-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Fill Form</h3>
            <p className="text-gray-400 text-sm">
              Share your authentic self through our detailed questionnaire
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-romantic-500 transition-all duration-300">
            <div className="w-12 h-12 bg-romantic-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Make Payment</h3>
            <p className="text-gray-400 text-sm">
              Secure one-time payment to start your journey
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-romantic-500 transition-all duration-300">
            <div className="w-12 h-12 bg-romantic-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Get Matched</h3>
            <p className="text-gray-400 text-sm">
              Our experts will find your perfect match offline
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12">
          <button
            onClick={handleGetStarted}
            className="btn-primary text-lg px-8 py-4"
          >
            Start Blind Date
          </button>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
          <div className="flex items-start space-x-4">
            <div className="text-romantic-500 text-2xl">✨</div>
            <div>
              <h4 className="font-semibold text-white mb-1">No Profiles</h4>
              <p className="text-gray-400 text-sm">
                Focus on personality, not appearance
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="text-romantic-500 text-2xl">🔒</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Secure & Private</h4>
              <p className="text-gray-400 text-sm">
                Your data is protected and confidential
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="text-romantic-500 text-2xl">💝</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Expert Matching</h4>
              <p className="text-gray-400 text-sm">
                Hand-picked matches by our team
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="text-romantic-500 text-2xl">🎯</div>
            <div>
              <h4 className="font-semibold text-white mb-1">One-Time Payment</h4>
              <p className="text-gray-400 text-sm">
                Simple, transparent pricing
              </p>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="mt-20 text-center text-gray-400 text-sm border-t border-gray-700 pt-6">
          <p className="mb-2">
            Facing any issues? Message ous on{" "}
            <a
              href="https://www.instagram.com/valentine.assist?igsh=MXNrNDhseW8yb2ZyOQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-romantic-500 font-semibold hover:underline"
            >
              @valentine.assist
            </a>
          </p>
          <p className="text-gray-500">
            © {new Date().getFullYear()} valentine.assist . All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;


