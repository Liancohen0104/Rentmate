import React, { useState } from 'react';
// 🔥 NEW IMPORTS - Added these 2 lines
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  // 🔥 NEW HOOKS - Added these 2 lines
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  // 🔥 UPDATED FUNCTION - Changed the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // 🔥 NEW - Use AuthContext to handle login
      const result = await login(data.user, data.token);
      
      if (result.success) {
        // 🔥 NEW - Navigate to home page using React Router
        navigate('/results', { replace: true });
      } else {
        setError(result.error);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 UPDATED FUNCTION - Changed from window.location.href to navigate
  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-yellow-400 transform rotate-45 opacity-60 animate-float"></div>
        <div className="absolute top-1/3 right-20 w-6 h-6 bg-blue-400 rounded-full opacity-40 animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-pink-400 transform rotate-45 opacity-50 animate-float animation-delay-3000"></div>
        <div className="absolute top-2/3 left-1/4 w-5 h-5 bg-green-400 rounded-full opacity-30 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          {/* Epic Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-3xl shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                  <span className="text-white font-bold text-5xl animate-bounce">🏡</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-6xl sm:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                Welcome
              </span>
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Back to <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Rentmate</span>
            </h2>
            <p className="text-xl text-purple-200 mb-4">
              Your AI-powered home awaits ✨
            </p>
            
            {/* Animated divider */}
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
            </div>
          </div>

          {/* Glass Morphism Login Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12">
              
              {/* Error Message */}
              {error && (
                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur"></div>
                  <div className="relative bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-2xl p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-3xl animate-bounce">⚠️</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-red-200 font-semibold">{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                {/* Email Field */}
                <div className="group relative">
                  <label className="block text-sm font-bold text-blue-200 mb-3 group-focus-within:text-white transition-colors duration-300">
                    <span className="flex items-center">
                      📧 Email Address
                      <div className="ml-2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-focus-within:opacity-100 animate-pulse transition-opacity"></div>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-500 group-hover:bg-white/15"
                      placeholder="your@email.com"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10 blur"></div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="group relative">
                  <label className="block text-sm font-bold text-purple-200 mb-3 group-focus-within:text-white transition-colors duration-300">
                    <span className="flex items-center">
                      🔐 Password
                      <div className="ml-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-focus-within:opacity-100 animate-pulse transition-opacity"></div>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-500 group-hover:bg-white/15"
                      placeholder="Enter your password"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10 blur"></div>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hover:from-blue-300 hover:to-purple-300 transition-all duration-300"
                    >
                    Forgot password? 
                  </button>
                </div>

              {/* Epic Login Button */}
                <div className="pt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.email || !formData.password}
                    className="group relative w-full py-5 overflow-hidden rounded-2xl font-bold text-xl text-white transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient-x opacity-20"></div>
                    
                    <span className="relative flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin mr-4 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing you in...
                        </>
                      ) : (
                        <>
                          Sign In to Your Future
                          <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">✨</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-12 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-purple-200 text-lg mb-4">
                New to this amazing journey? 🎭
              </p>
              <button
                onClick={goToRegister}
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
              >
                <span className="relative">
                  ✨ Create Your Account
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">🌟</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional magical elements */}
      <div className="fixed top-10 right-10 w-6 h-6 bg-yellow-400 rounded-full opacity-60 animate-pulse hidden lg:block"></div>
      <div className="fixed bottom-20 right-20 w-4 h-4 bg-pink-400 rounded-full opacity-40 animate-bounce hidden lg:block" style={{animationDelay: '1s'}}></div>
      <div className="fixed top-1/2 left-8 w-3 h-3 bg-blue-400 rounded-full opacity-50 animate-pulse hidden lg:block" style={{animationDelay: '2s'}}></div>
      <div className="fixed bottom-1/3 left-1/4 w-5 h-5 bg-green-400 transform rotate-45 opacity-30 animate-spin-slow hidden lg:block"></div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            transform: translateX(-50%);
          }
          50% {
            transform: translateX(50%);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes tilt {
          0%, 50%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-tilt {
          animation: tilt 3s infinite linear;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;