// pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ apartments: 0, matches: 0, users: 0 });

  useEffect(() => {
    // Fetch stats
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/apartments/all');
      const data = await response.json();
      setStats(prev => ({ ...prev, apartments: data.length || 247 }));
    } catch (err) {
      setStats({ apartments: 247, matches: 1523, users: 892 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-blue-400 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-purple-400 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-float animation-delay-3000"></div>
      </div>

      <div className="relative z-10 pt-24 pb-20">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            {/* Main Logo/Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-500 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-full shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                  <span className="text-white font-bold text-7xl">🏡</span>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                Rentmate
              </span>
            </h1>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
              מצא את הבית המושלם שלך
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                בעזרת בינה מלאכותית
              </span>
            </h2>

            <p className="text-xl sm:text-2xl text-purple-200 max-w-3xl mx-auto mb-12 leading-relaxed" dir="rtl">
              פלטפורמת השכרת דירות החכמה בישראל. אנחנו משתמשים ב-AI מתקדם כדי למצוא את הדירה המתאימה ביותר לך, בהתאם להעדפות האישיות שלך.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {isAuthenticated() ? (
                <>
                  <button
                    onClick={() => navigate('/search')}
                    className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center">
                      חפש דירות
                      <span className="mr-3 text-2xl">🔍</span>
                    </span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/results')}
                    className="group relative px-10 py-5 bg-gradient-to-r from-pink-600 to-orange-500 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-pink-500/50 transform hover:scale-110 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center">
                      ההמלצות שלי
                      <span className="mr-3 text-2xl">⭐</span>
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/register')}
                    className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center">
                      התחל עכשיו
                      <span className="mr-3 text-3xl group-hover:translate-x-2 transition-transform duration-300">✨</span>
                    </span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/login')}
                    className="px-12 py-6 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-2xl font-bold rounded-2xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
                  >
                    כניסה
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="text-5xl mb-4">🏘️</div>
                <div className="text-5xl font-black text-white mb-2">
                  +{stats.apartments}
                </div>
                <div className="text-xl text-purple-200" dir="rtl">דירות פעילות</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="text-5xl mb-4">🤝</div>
                <div className="text-5xl font-black text-white mb-2">
                  +1,500
                </div>
                <div className="text-xl text-purple-200" dir="rtl">התאמות מוצלחות</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="text-5xl mb-4">👥</div>
                <div className="text-5xl font-black text-white mb-2">
                  +890
                </div>
                <div className="text-xl text-purple-200" dir="rtl">משתמשים מרוצים</div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-white text-center mb-4">
              ?Rentmate למה
            </h2>
            <p className="text-xl text-purple-200 text-center mb-12" dir="rtl">
              הטכנולוגיה המתקדמת ביותר לחיפוש דירות
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-blue-400/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300" dir="rtl">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-3">בינה מלאכותית</h3>
                <p className="text-purple-200">
                  AI מתקדם שמדרג ומתאים דירות לפי ההעדפות האישיות שלך
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-pink-400/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300" dir="rtl">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">חיפוש מהיר</h3>
                <p className="text-purple-200">
                  מצא את הדירה המושלמת תוך שניות עם מנוע החיפוש החכם שלנו
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-green-400/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300" dir="rtl">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-3">התאמה מדויקת</h3>
                <p className="text-purple-200">
                  מסננים מתקדמים שמבטיחים שתמצא בדיוק מה שאתה מחפש
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-yellow-400/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300" dir="rtl">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-3">חינם לגמרי</h3>
                <p className="text-purple-200">
                  כל השירותים שלנו זמינים בחינם, ללא עמלות נסתרות
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-white text-center mb-4">
              ?איך זה עובד
            </h2>
            <p className="text-xl text-purple-200 text-center mb-12" dir="rtl">
              3 צעדים פשוטים למציאת הדירה המושלמת
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center" dir="rtl">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    3
                  </div>
                  <div className="text-5xl mb-6 mt-4">🏠</div>
                  <h3 className="text-2xl font-bold text-white mb-3">עבור לדירה החדשה</h3>
                  <p className="text-purple-200">
                      צור קשר עם המפרסם והתחל את החיים בבית החדש שלך
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center" dir="rtl">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2
                  </div>
                  <div className="text-5xl mb-6 mt-4">🎯</div>
                  <h3 className="text-2xl font-bold text-white mb-3">קבל המלצות</h3>
                  <p className="text-purple-200">
                    ה-AI שלנו מנתח אלפי דירות ומציג לך את ההתאמות הכי טובות
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center" dir="rtl">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                  <div className="text-5xl mb-6 mt-4">📝</div>
                  <h3 className="text-2xl font-bold text-white mb-3">הרשם</h3>
                  <p className="text-purple-200">
                    צור חשבון והזן את ההעדפות שלך - עיר, מחיר, גודל ועוד
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          {!isAuthenticated() && (
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
              <h2 className="text-4xl font-black text-white mb-4" dir="rtl">
                מוכנים למצוא את הבית המושלם?
              </h2>
              <p className="text-xl text-purple-200 mb-8" dir="rtl">
                הצטרפו לאלפי משתמשים מרוצים שכבר מצאו את ביתם דרכנו
              </p>
              <button
                onClick={() => navigate('/register')}
                className="group relative px-12 py-6 bg-gradient-to-r from-pink-600 to-orange-500 text-white text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-pink-500/50 transform hover:scale-110 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  התחילו בחינם
                  <span className="mr-3 text-3xl group-hover:translate-x-2 transition-transform duration-300">🚀</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
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

export default HomePage;