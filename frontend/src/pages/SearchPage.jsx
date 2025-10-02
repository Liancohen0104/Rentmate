// pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Image Gallery Component with Navigation
const ImageGalleryModal = ({ apartment }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Combine cover image with additional images
  const allImages = [apartment.coverImage, ...(apartment.images || [])].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (allImages.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
        <span className="text-9xl">🏠</span>
      </div>
    );
  }

  return (
    <div className="relative h-96 bg-black">
      {/* Main Image */}
      <img
        src={allImages[currentImageIndex]}
        alt={`תמונה ${currentImageIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Navigation Arrows - ONLY ARROWS, no counter or thumbnails */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300 z-20 backdrop-blur-sm shadow-lg"
          >
            ←
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300 z-20 backdrop-blur-sm shadow-lg"
          >
            →
          </button>
        </>
      )}
    </div>
  );
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    city: '',
    neighborhood: '',
    minPrice: '',
    maxPrice: '',
    minRooms: '',
    maxRooms: '',
    minSize: '',
    maxSize: '',
    propertyType: '',
    minFloor: '',
    maxFloor: '',
  });

  useEffect(() => {
    fetchAllApartments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, apartments]);

  const fetchAllApartments = async () => {
    try {
      const response = await fetch('http://localhost:4000/apartments/all');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch apartments');
      }

      setApartments(data);
      setFilteredApartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...apartments];

    if (filters.city) {
      filtered = filtered.filter(apt => 
        apt.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.neighborhood) {
      filtered = filtered.filter(apt => 
        apt.neighborhood?.toLowerCase().includes(filters.neighborhood.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(apt => apt.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(apt => apt.price <= Number(filters.maxPrice));
    }

    if (filters.minRooms) {
      filtered = filtered.filter(apt => apt.rooms >= Number(filters.minRooms));
    }

    if (filters.maxRooms) {
      filtered = filtered.filter(apt => apt.rooms <= Number(filters.maxRooms));
    }

    if (filters.minSize) {
      filtered = filtered.filter(apt => apt.size >= Number(filters.minSize));
    }

    if (filters.maxSize) {
      filtered = filtered.filter(apt => apt.size <= Number(filters.maxSize));
    }

    if (filters.propertyType) {
      filtered = filtered.filter(apt => 
        apt.propertyType?.toLowerCase().includes(filters.propertyType.toLowerCase())
      );
    }

    if (filters.minFloor) {
      filtered = filtered.filter(apt => apt.floor >= Number(filters.minFloor));
    }

    if (filters.maxFloor) {
      filtered = filtered.filter(apt => apt.floor <= Number(filters.maxFloor));
    }

    setFilteredApartments(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      neighborhood: '',
      minPrice: '',
      maxPrice: '',
      minRooms: '',
      maxRooms: '',
      minSize: '',
      maxSize: '',
      propertyType: '',
      minFloor: '',
      maxFloor: '',
    });
  };

  const openApartmentModal = (apartment) => {
    setSelectedApartment(apartment);
  };

  const closeModal = () => {
    setSelectedApartment(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="bg-white/20 p-8 rounded-2xl mb-4 mx-auto w-24 h-24 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-4xl">🔍</span>
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">טוען דירות...</p>
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
            <h2 className="text-2xl font-bold text-white mb-4">שגיאה בטעינת דירות</h2>
            <p className="text-white/90 mb-6">{error}</p>
            <button
              onClick={fetchAllApartments}
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-4 rounded-2xl shadow-2xl animate-bounce">
                  <span className="text-white font-bold text-4xl">🔍</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <h1 className="text-5xl font-black text-white mb-4">
              חפש את הדירה המושלמת
            </h1>
            <p className="text-xl text-white/90 mb-4">
            
            {filteredApartments.length}     :דירות זמינות 
            
            </p>
            
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300"
            >
              <span className="mr-2">{showFilters ? '🔼' : '🔽'}</span>
              {showFilters ? 'הסתר מסננים' : 'הצג מסננים'}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-8 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20" dir="rtl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">מסננים מתקדמים</h2>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-500/30 hover:bg-red-500/50 text-white rounded-lg transition-all duration-300"
                >
                  נקה הכל
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Location */}
                <div>
                  <label className="block text-white font-semibold mb-2">עיר</label>
                  <input
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="תל אביב, ירושלים..."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">שכונה</label>
                  <input
                    name="neighborhood"
                    value={filters.neighborhood}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="מרכז, פלורנטין..."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">סוג נכס</label>
                  <select
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="" className="bg-gray-800">הכל</option>
                    <option value="apartment" className="bg-gray-800">דירה</option>
                    <option value="house" className="bg-gray-800">בית</option>
                    <option value="studio" className="bg-gray-800">סטודיו</option>
                    <option value="penthouse" className="bg-gray-800">פנטהאוז</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-white font-semibold mb-2">מחיר מינימום</label>
                  <input
                    name="minPrice"
                    type="number"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">מחיר מקסימום</label>
                  <input
                    name="maxPrice"
                    type="number"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="15000"
                  />
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-white font-semibold mb-2">חדרים מינימום</label>
                  <input
                    name="minRooms"
                    type="number"
                    value={filters.minRooms}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">חדרים מקסימום</label>
                  <input
                    name="maxRooms"
                    type="number"
                    value={filters.maxRooms}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="5"
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-white font-semibold mb-2">שטח מינימום (מ"ר)</label>
                  <input
                    name="minSize"
                    type="number"
                    value={filters.minSize}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">שטח מקסימום (מ"ר)</label>
                  <input
                    name="maxSize"
                    type="number"
                    value={filters.maxSize}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="150"
                  />
                </div>

                {/* Floor */}
                <div>
                  <label className="block text-white font-semibold mb-2">קומה מינימום</label>
                  <input
                    name="minFloor"
                    type="number"
                    value={filters.minFloor}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">קומה מקסימום</label>
                  <input
                    name="maxFloor"
                    type="number"
                    value={filters.maxFloor}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          {filteredApartments.length === 0 ? (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center" dir="rtl">
                <div className="text-6xl mb-6">🔍</div>
                <h2 className="text-3xl font-bold text-white mb-4">לא נמצאו תוצאות</h2>
                <p className="text-white/90 mb-6 text-lg">
                  נסה לשנות את המסננים או לנקות אותם
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
                >
                  נקה מסננים
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredApartments.map((apartment) => (
                <div
                  key={apartment.id}
                  className="group relative bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                  onClick={() => openApartmentModal(apartment)}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500">
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
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                        ₪{apartment.price?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-right" dir="rtl">
                    {/* Location */}
                    <h3 className="text-xl font-bold text-white mb-1">
                      {apartment.street} {apartment.houseNumber}
                    </h3>
                    <p className="text-white/80 mb-4">
                      {apartment.neighborhood ? `${apartment.neighborhood}, ` : ''}
                      {apartment.city}
                    </p>

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

                    {/* Tags */}
                    {apartment.tags && apartment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {apartment.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-white/10 text-white/90 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {apartment.tags.length > 3 && (
                          <span className="bg-white/10 text-white/90 px-2 py-1 rounded text-xs">
                            +{apartment.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* View Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300">
                      צפה בפרטים
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              className="absolute top-4 left-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 z-10"
            >
              ✕
            </button>

            {/* Image Gallery with Navigation */}
            <ImageGalleryModal apartment={selectedApartment} />

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
                        className="bg-cyan-500/30 text-cyan-200 px-4 py-2 rounded-xl"
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

export default SearchPage;