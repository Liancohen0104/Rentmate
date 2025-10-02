// pages/ResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Image Gallery Component
const ImageGallery = ({ images, coverImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Combine cover image with other images
  const allImages = [coverImage, ...(images || [])].filter(Boolean);
  
  if (allImages.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <span className="text-9xl">🏠</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="relative h-96 bg-black">
      {/* Main Image */}
      <img
        src={allImages[currentIndex]}
        alt={`תמונה ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {/* Navigation Arrows - ONLY ARROWS */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300 z-10 backdrop-blur-sm shadow-lg"
          >
            ←
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300 z-10 backdrop-blur-sm shadow-lg"
          >
            →
          </button>
        </>
      )}
    </div>
  );
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApartment, setSelectedApartment] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/apartment-match', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch results');
      }

      setResults(data.results || []);
      setMeta(data.meta || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openApartmentModal = (apartment) => {
    setSelectedApartment(apartment);
  };

  const closeModal = () => {
    setSelectedApartment(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="bg-white/20 p-8 rounded-2xl mb-4 mx-auto w-24 h-24 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-4xl">🏠</span>
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">...מחפש את הדירות המושלמות עבורך</p>
          <p className="text-white/80 mt-2">AI מדרג את הדירות לפי העדפותיך</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 flex items-center justify-center pt-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">שגיאה בטעינת תוצאות</h2>
            <p className="text-white/90 mb-6">{error}</p>
            <button
              onClick={fetchResults}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300"
            >
              נסה שוב
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-2xl">
                  <span className="text-white font-bold text-4xl">🎯</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <h1 className="text-5xl font-black text-white mb-4">
              הדירות המושלמות עבורך
            </h1>
            <p className="text-xl text-white/90 mb-2">
              לפי העדפותיך האישיות AI מדורג על ידי
            </p>
            {meta && (
              <div className="inline-flex items-center space-x-2 space-x-reverse bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <span className="text-white/90"> {results.length} :דירות מתאימות </span>
              </div>
            )}
          </div>

          {/* No Results */}
          {results.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
                <div className="text-6xl mb-6">🔍</div>
                <h2 className="text-3xl font-bold text-white mb-4">לא נמצאו דירות מתאימות</h2>
                <p className="text-white/90 mb-8 text-lg">
                  נסה לעדכן את העדפות החיפוש שלך או להרחיב את הקריטריונים
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  עדכן העדפות
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((apartment, index) => (
                <div
                  key={apartment.id}
                  className="group relative bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                  onClick={() => openApartmentModal(apartment)}
                >
                  {/* Rank Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 space-x-reverse">
                      <span>#{index + 1}</span>
                      <span>🏆</span>
                    </div>
                  </div>

                  {/* AI Score Badge */}
                  {apartment.aiScore && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                        <span className="text-sm">⭐ {Math.round(apartment.aiScore)}</span>
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                    {apartment.coverImage ? (
                      <img
                        src={apartment.coverImage}
                        alt={`דירה ב${apartment.city}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">🏠</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-right" dir="rtl">
                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl font-black text-white">
                        ₪{apartment.price?.toLocaleString()}
                        {apartment.priceBefore && apartment.priceBefore > apartment.price && (
                          <span className="text-sm line-through text-white/60 mr-2">
                            ₪{apartment.priceBefore.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="text-white/80 text-sm">לחודש</div>
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {apartment.street} {apartment.houseNumber}
                      </h3>
                      <p className="text-white/80">
                        {apartment.neighborhood ? `${apartment.neighborhood}, ` : ''}
                        {apartment.city}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-white/20">
                      <div className="text-center">
                        <div className="text-2xl mb-1">🛏️</div>
                        <div className="text-white font-semibold">{apartment.rooms}</div>
                        <div className="text-white/70 text-xs">חדרים</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-1">📐</div>
                        <div className="text-white font-semibold">{apartment.size}m²</div>
                        <div className="text-white/70 text-xs">שטח</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-1">🏢</div>
                        <div className="text-white font-semibold">{apartment.floor || '-'}</div>
                        <div className="text-white/70 text-xs">קומה</div>
                      </div>
                    </div>

                    {/* Property Type & Condition */}
                    <div className="flex items-center justify-between mb-4">
                      {apartment.propertyType && (
                        <span className="bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm">
                          {apartment.propertyType}
                        </span>
                      )}
                      {apartment.conditionText && (
                        <span className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm">
                          {apartment.conditionText}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {apartment.tags && apartment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {apartment.tags.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-white/10 text-white/90 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {apartment.tags.length > 4 && (
                          <span className="bg-white/10 text-white/90 px-2 py-1 rounded text-xs">
                            +{apartment.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* View Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105">
                      צפה בפרטים המלאים
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Meta Info - Hidden from users, only for debugging */}
          {/* {meta && (
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-right" dir="rtl">
                <h3 className="text-xl font-bold text-white mb-3">מידע נוסף</h3>
                <div className="space-y-2 text-white/80">
                  {meta.ai && <p>🤖 דירוג AI: {meta.ai}</p>}
                  {meta.reason && <p>📝 {meta.reason}</p>}
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* Apartment Detail Modal */}
      {selectedApartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
          <div 
            className="bg-white/10 backdrop-blur-2xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 left-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300"
            >
              ✕
            </button>

            {/* Image Gallery */}
            <ImageGallery images={selectedApartment.images} coverImage={selectedApartment.coverImage} />

            {/* Content */}
            <div className="p-8 text-right">
              {/* Price */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/20">
                <div>
                  <div className="text-4xl font-black text-white mb-2">
                    ₪{selectedApartment.price?.toLocaleString()}
                    <span className="text-lg text-white/70 mr-2">לחודש</span>
                  </div>
                  {selectedApartment.priceBefore && selectedApartment.priceBefore > selectedApartment.price && (
                    <div className="text-white/60 line-through">
                      ₪{selectedApartment.priceBefore.toLocaleString()}
                    </div>
                  )}
                </div>
                {selectedApartment.aiScore && (
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold px-6 py-3 rounded-2xl">
                    <div className="text-3xl">⭐ {Math.round(selectedApartment.aiScore)}</div>
                    <div className="text-xs">ציון AI</div>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedApartment.street} {selectedApartment.houseNumber}
                </h2>
                <p className="text-xl text-white/80">
                  {selectedApartment.neighborhood ? `${selectedApartment.neighborhood}, ` : ''}
                  {selectedApartment.city}
                </p>
                {selectedApartment.area && (
                  <p className="text-white/70">{selectedApartment.area}</p>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 pb-6 border-b border-white/20">
                <div className="text-center bg-white/5 rounded-xl p-4">
                  <div className="text-3xl mb-2">🛏️</div>
                  <div className="text-2xl font-bold text-white">{selectedApartment.rooms}</div>
                  <div className="text-white/70">חדרים</div>
                </div>
                <div className="text-center bg-white/5 rounded-xl p-4">
                  <div className="text-3xl mb-2">📐</div>
                  <div className="text-2xl font-bold text-white">{selectedApartment.size}m²</div>
                  <div className="text-white/70">שטח</div>
                </div>
                <div className="text-center bg-white/5 rounded-xl p-4">
                  <div className="text-3xl mb-2">🏢</div>
                  <div className="text-2xl font-bold text-white">{selectedApartment.floor || '-'}</div>
                  <div className="text-white/70">קומה</div>
                </div>
                <div className="text-center bg-white/5 rounded-xl p-4">
                  <div className="text-3xl mb-2">🏠</div>
                  <div className="text-sm font-bold text-white">{selectedApartment.propertyType || '-'}</div>
                  <div className="text-white/70">סוג נכס</div>
                </div>
              </div>

              {/* Condition */}
              {selectedApartment.conditionText && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-3">מצב הנכס</h3>
                  <span className="inline-block bg-purple-500/30 text-purple-200 px-4 py-2 rounded-xl">
                    {selectedApartment.conditionText}
                  </span>
                </div>
              )}

              {/* Tags */}
              {selectedApartment.tags && selectedApartment.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-3">מאפיינים</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApartment.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-500/30 text-blue-200 px-4 py-2 rounded-xl"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <a
                  href={`https://www.yad2.co.il/realestate/item/${selectedApartment.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-center"
                >
                  קישור למודעה המקורית
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;