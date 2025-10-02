// pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-md mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12 text-center">
            <div className="mb-6">
              <div className="inline-block bg-green-500/20 p-4 rounded-full mb-4">
                <span className="text-6xl">✉️</span>
              </div>
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-white text-3xl">✓</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Email Sent Successfully!
            </h2>
            <p className="text-white/90 mb-6 text-lg">
              We've sent a password reset link to:
            </p>
            <p className="text-white font-semibold text-xl mb-8 bg-white/10 py-3 px-4 rounded-xl">
              {email}
            </p>
            <p className="text-white/80 mb-8">
              Check your inbox and click the link to reset your password. The link will expire in 1 hour.
            </p>

            <button
              onClick={goToLogin}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-cyan-400 transform rotate-45 opacity-60 animate-float"></div>
        <div className="absolute top-1/3 right-20 w-6 h-6 bg-blue-400 rounded-full opacity-40 animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-purple-400 transform rotate-45 opacity-50 animate-float animation-delay-3000"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 p-5 rounded-3xl shadow-2xl">
                  <span className="text-white font-bold text-4xl">🔑</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-black text-white mb-3">
              Forgot Password?
            </h1>
            <p className="text-xl text-blue-200">
              No worries, we'll send you reset instructions
            </p>
          </div>

          {/* Form Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
              
              {/* Error Message */}
              {error && (
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur"></div>
                  <div className="relative bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-2xl p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">⚠️</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-red-200 font-semibold">{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-500 group-hover:bg-white/15"
                      placeholder="Enter your email address"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10 blur"></div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="group relative w-full py-5 overflow-hidden rounded-2xl font-bold text-xl text-white transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <span className="relative flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin mr-4 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Email...
                        </>
                      ) : (
                        <>
                          Send Reset Link
                          <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">📨</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <button
                onClick={goToLogin}
                className="text-blue-300 hover:text-blue-200 font-semibold transition-colors duration-300"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
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

export default ForgotPasswordPage;