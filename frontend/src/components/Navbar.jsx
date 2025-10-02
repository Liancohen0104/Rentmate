// components/common/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close mobile menu
  };

  // Don't show navbar on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigation('/search')}
          >
          <div className="group-hover:scale-110 transition-transform duration-300">
            <img 
              src="/icon.png" 
              alt="RentMate Logo" 
              className="w-14 h-14 object-contain"
            />
          </div>
            <span className="text-2xl font-bold text-white">Rentmate</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated() && (
              <>
                <button
                  onClick={() => handleNavigation('/search')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    location.pathname === '/search' 
                      ? 'text-white bg-white/20 shadow-lg' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🔍 Search
                </button>
                <button
                  onClick={() => handleNavigation('/results')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    location.pathname === '/results' 
                      ? 'text-white bg-white/20 shadow-lg' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📋 Results
                </button>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.firstName ? user.firstName.charAt(0).toUpperCase() : '👤'}
                    </span>
                  </div>
                  <span className="text-white font-medium hidden sm:block">
                    {user?.firstName || 'User'}
                  </span>
                  <svg 
                    className={`w-4 h-4 text-white transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden">
                    <div className="py-2">
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="flex items-center w-full px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <span className="mr-3 text-lg">👤</span>
                        Profile Settings
                      </button>
                      <div className="border-t border-white/20 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors"
                      >
                        <span className="mr-3 text-lg">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-3">
                <button
                  onClick={() => handleNavigation('/login')}
                  className="px-4 py-2 text-white/90 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-white/5 backdrop-blur-md">
            <div className="px-2 py-3 space-y-1">
              {isAuthenticated() && (
                <>
                  <button
                    onClick={() => handleNavigation('/search')}
                    className="block w-full text-left px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    🔍 Search
                  </button>
                  <button
                    onClick={() => handleNavigation('/results')}
                    className="block w-full text-left px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    📋 Results
                  </button>
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="block w-full text-left px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    👤 Profile
                  </button>
                  <div className="border-t border-white/20 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    🚪 Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;