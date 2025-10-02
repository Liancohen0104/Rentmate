// pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // If no token, show error
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h2>
            <p className="text-white/90 mb-6">This password reset link is invalid or has expired.</p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300"
            >
              Request New Link
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4 animate-bounce">
                <span className="text-white text-4xl">✓</span>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-4">
              Password Reset Successful!
            </h2>
            <p className="text-white/90 mb-6 text-lg">
              Your password has been reset successfully.
            </p>
            <p className="text-white/80 mb-8">
              Redirecting you to login in 3 seconds...
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-pink-400 transform rotate-45 opacity-60 animate-float"></div>
        <div className="absolute top-1/3 right-20 w-6 h-6 bg-purple-400 rounded-full opacity-40 animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-blue-400 transform rotate-45 opacity-50 animate-float animation-delay-3000"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-700 p-5 rounded-3xl shadow-2xl">
                  <span className="text-white font-bold text-4xl">🔐</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-black text-white mb-3">
              Reset Password
            </h1>
            <p className="text-xl text-purple-200">
              Create a new secure password
            </p>
          </div>

          {/* Form Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl"></div>
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
                {/* New Password Field */}
                <div className="group relative">
                  <label className="block text-sm font-bold text-purple-200 mb-3 group-focus-within:text-white transition-colors duration-300">
                    <span className="flex items-center">
                      🔒 New Password
                      <div className="ml-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-focus-within:opacity-100 animate-pulse transition-opacity"></div>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      name="newPassword"
                      type="password"
                      required
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-500 group-hover:bg-white/15"
                      placeholder="Enter new password (min 6 characters)"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10 blur"></div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="group relative">
                  <label className="block text-sm font-bold text-purple-200 mb-3 group-focus-within:text-white transition-colors duration-300">
                    <span className="flex items-center">
                      🔐 Confirm Password
                      <div className="ml-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-focus-within:opacity-100 animate-pulse transition-opacity"></div>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-500 group-hover:bg-white/15"
                      placeholder="Confirm your new password"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10 blur"></div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm">Password Strength</span>
                      <span className={`text-sm font-semibold ${
                        formData.newPassword.length < 6 ? 'text-red-400' :
                        formData.newPassword.length < 8 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {formData.newPassword.length < 6 ? 'Weak' :
                         formData.newPassword.length < 8 ? 'Medium' :
                         'Strong'}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          formData.newPassword.length < 6 ? 'bg-red-500 w-1/3' :
                          formData.newPassword.length < 8 ? 'bg-yellow-500 w-2/3' :
                          'bg-green-500 w-full'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
                    className="group relative w-full py-5 overflow-hidden rounded-2xl font-bold text-xl text-white transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <span className="relative flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin mr-4 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          Reset Password
                          <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">🔓</span>
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
                onClick={() => navigate('/login')}
                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-300"
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

export default ResetPasswordPage;