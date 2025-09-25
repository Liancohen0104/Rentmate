import React from 'react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user, logout, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return null;
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <span className="text-2xl">🏡</span>
                </div>
                <span className="text-2xl font-bold text-white">Rentmate</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-white/90">Hello, {user?.firstName}! 👋</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Success Message */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
              <div className="mb-8">
                <span className="text-8xl animate-bounce">🎉</span>
              </div>
              
              <h1 className="text-5xl font-bold text-white mb-6">
                Welcome to Rentmate!
              </h1>
              
              <p className="text-xl text-white/80 mb-8">
                🎊 Congratulations! Your account has been successfully created. 
                <br />
                You're now ready to find your perfect rental home with AI assistance!
              </p>

              {/* User Info Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Account Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-white/10 rounded-xl p-4">
                    <span className="text-white/70 text-sm">Name</span>
                    <p className="text-white font-semibold">{user?.firstName} {user?.lastName}</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-4">
                    <span className="text-white/70 text-sm">Email</span>
                    <p className="text-white font-semibold">{user?.email}</p>
                  </div>
                  
                  {user?.preferredCity && (
                    <div className="bg-white/10 rounded-xl p-4">
                      <span className="text-white/70 text-sm">Preferred City</span>
                      <p className="text-white font-semibold">{user.preferredCity}</p>
                    </div>
                  )}
                  
                  {user?.prefPriority && (
                    <div className="bg-white/10 rounded-xl p-4">
                      <span className="text-white/70 text-sm">Priority</span>
                      <p className="text-white font-semibold capitalize">{user.prefPriority}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-400/30">
                <h3 className="text-xl font-semibold text-white mb-4">🚀 What's Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white/10 rounded-xl p-4">
                    <span className="text-3xl mb-2 block">🔍</span>
                    <span className="text-white/90">Search for apartments</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <span className="text-3xl mb-2 block">🤖</span>
                    <span className="text-white/90">Get AI recommendations</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <span className="text-3xl mb-2 block">🏠</span>
                    <span className="text-white/90">Find your dream home</span>
                  </div>
                </div>
              </div>

              {/* Coming Soon Message */}
              <div className="mt-8 text-center">
                <p className="text-white/70 text-lg">
                  🚧 More amazing features coming soon! 
                  <br />
                  Search functionality, AI scoring, and much more.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;