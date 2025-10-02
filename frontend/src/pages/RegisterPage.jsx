import React, { useState } from 'react';
// 🔥 NEW IMPORTS - Added these 2 lines
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  // 🔥 NEW HOOKS - Added these 2 lines
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Search Preferences
    preferredCity: '',
    preferredNeighborhood: '',
    prefMinRooms: '',
    prefMaxRooms: '',
    prefMinPrice: '',
    prefMaxPrice: '',
    prefMinSquareMeter: '',
    prefMaxSquareMeter: '',
    prefPropertyType: '',
    prefMinFloor: '',
    prefMaxFloor: '',
    prefTagsWanted: '',
    prefTagsExcluded: '',
    prefPriority: ''
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

  const validateStep1 = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    setCurrentStep(2);
    setError('');
  };

  const prevStep = () => {
    setCurrentStep(1);
    setError('');
  };

  // 🔥 UPDATED FUNCTION - Changed the handleSubmit function
  const handleSubmit = async () => {
  setIsLoading(true);
  setError('');

  try {
    // Process the form data before sending to backend
    const processedData = {
      ...formData,
      role: "member",
      
      // Convert comma-separated strings to arrays
      prefTagsWanted: (formData.prefTagsWanted && formData.prefTagsWanted.trim()) 
        ? formData.prefTagsWanted.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [],
        
      prefTagsExcluded: (formData.prefTagsExcluded && formData.prefTagsExcluded.trim())
        ? formData.prefTagsExcluded.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [],
      
      // Convert string numbers to integers
      prefMinRooms: formData.prefMinRooms && formData.prefMinRooms.trim() ? parseInt(formData.prefMinRooms) : null,
      prefMaxRooms: formData.prefMaxRooms && formData.prefMaxRooms.trim() ? parseInt(formData.prefMaxRooms) : null,
      prefMinPrice: formData.prefMinPrice && formData.prefMinPrice.trim() ? parseInt(formData.prefMinPrice) : null,
      prefMaxPrice: formData.prefMaxPrice && formData.prefMaxPrice.trim() ? parseInt(formData.prefMaxPrice) : null,
      prefMinSquareMeter: formData.prefMinSquareMeter && formData.prefMinSquareMeter.trim() ? parseInt(formData.prefMinSquareMeter) : null,
      prefMaxSquareMeter: formData.prefMaxSquareMeter && formData.prefMaxSquareMeter.trim() ? parseInt(formData.prefMaxSquareMeter) : null,
      prefMinFloor: formData.prefMinFloor && formData.prefMinFloor.trim() ? parseInt(formData.prefMinFloor) : null,
      prefMaxFloor: formData.prefMaxFloor && formData.prefMaxFloor.trim() ? parseInt(formData.prefMaxFloor) : null,
    };

    const response = await fetch('http://localhost:4000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(processedData), // Send processedData, not formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    const result = await register(data.user, data.token);
    
    if (result.success) {
      navigate('/', { replace: true });
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
  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Amazing Design */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <span className="text-white font-bold text-4xl">🏡</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 tracking-tight">
              Join <span className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">Rentmate</span>
            </h1>
            <p className="text-xl text-blue-200 mb-2">
              Find your perfect home with AI magic ✨
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto rounded-full"></div>
          </div>

          {/* Stunning Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-8">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  currentStep >= 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-300'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:block">Personal Info</span>
              </div>
              
              <div className="flex-1 h-0.5 bg-gray-200 mx-4 max-w-24">
                <div className={`h-full bg-blue-600 transition-all duration-300 ${currentStep >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  currentStep >= 2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-300'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:block">Preferences</span>
              </div>
            </div>
          </div>

          {/* Form Container with Glass Effect */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12">
            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-2xl">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚠️</span>
                  <p className="text-red-200 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">Let's get to know you! 👋</h2>
                  <p className="text-blue-200">Tell us a bit about yourself</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-blue-200 mb-2 group-focus-within:text-white transition-colors">
                      First Name ✨
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300"
                      placeholder="Your first name"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-blue-200 mb-2 group-focus-within:text-white transition-colors">
                      Last Name ✨
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-blue-200 mb-2 group-focus-within:text-white transition-colors">
                    Email Address 📧
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-blue-200 mb-2 group-focus-within:text-white transition-colors">
                      Password 🔐
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300"
                      placeholder="At least 6 characters"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-blue-200 mb-2 group-focus-within:text-white transition-colors">
                      Confirm Password 🔐
                    </label>
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={nextStep}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                  >
                    <span className="flex items-center">
                      Next: Tell us your dream home 
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">🏠✨</span>
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Dream Home Preferences */}
            {currentStep === 2 && (
              <div className="space-y-10">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-4">🏠 Describe Your Dream Home</h2>
                  <p className="text-blue-200 text-lg">Help our AI find the perfect match for you!</p>
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-400/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    📍 Location Dreams
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-blue-200 mb-2">
                        Preferred City 🌆
                      </label>
                      <input
                        name="preferredCity"
                        type="text"
                        value={formData.preferredCity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300"
                        placeholder="Tel Aviv, Jerusalem..."
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-sm font-semibold text-blue-200 mb-2">
                        Neighborhood 🏘️
                      </label>
                      <input
                        name="preferredNeighborhood"
                        type="text"
                        value={formData.preferredNeighborhood}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300"
                        placeholder="Center, Florentin..."
                      />
                    </div>
                  </div>
                </div>

                {/* Size & Budget Section */}
                <div className="bg-gradient-to-r from-pink-500/10 to-yellow-500/10 rounded-2xl p-6 border border-pink-400/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    💰 Size & Budget
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="group">
                      <label className="block text-xs font-semibold text-pink-200 mb-2">
                        Min Rooms 🛏️
                      </label>
                      <input
                        name="prefMinRooms"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.prefMinRooms}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50 focus:border-pink-400 transition-all duration-300"
                        placeholder="1"
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-xs font-semibold text-pink-200 mb-2">
                        Max Rooms 🛏️
                      </label>
                      <input
                        name="prefMaxRooms"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.prefMaxRooms}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50 focus:border-pink-400 transition-all duration-300"
                        placeholder="4"
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-xs font-semibold text-pink-200 mb-2">
                        Min Price (₪) 💸
                      </label>
                      <input
                        name="prefMinPrice"
                        type="number"
                        min="0"
                        step="500"
                        value={formData.prefMinPrice}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50 focus:border-pink-400 transition-all duration-300"
                        placeholder="5000"
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-xs font-semibold text-pink-200 mb-2">
                        Max Price (₪) 💸
                      </label>
                      <input
                        name="prefMaxPrice"
                        type="number"
                        min="0"
                        step="500"
                        value={formData.prefMaxPrice}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50 focus:border-pink-400 transition-all duration-300"
                        placeholder="12000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-pink-200 mb-2">
                        Min Square Meters 📐
                      </label>
                      <input
                        name="prefMinSquareMeter"
                        type="number"
                        min="0"
                        value={formData.prefMinSquareMeter}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50 focus:border-pink-400 transition-all duration-300"
                        placeholder="50"
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-sm font-semibold text-pink-200 mb-2">
                        Max Square Meters 📐
                      </label>
                      <input
                        name="prefMaxSquareMeter"
                        type="number"
                        min="0"
                        value={formData.prefMaxSquareMeter}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50 focus:border-pink-400 transition-all duration-300"
                        placeholder="150"
                      />
                    </div>
                  </div>
                </div>

                {/* Property Details Section */}
                <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-2xl p-6 border border-green-400/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    🏢 Property Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-green-200 mb-2">
                        Property Type 🏠
                      </label>
                      <select
                        name="prefPropertyType"
                        value={formData.prefPropertyType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300"
                      >
                        <option value="" className="bg-gray-800">Any Type</option>
                        <option value="apartment" className="bg-gray-800">Apartment</option>
                        <option value="house" className="bg-gray-800">House</option>
                        <option value="studio" className="bg-gray-800">Studio</option>
                        <option value="penthouse" className="bg-gray-800">Penthouse</option>
                      </select>
                    </div>
                    
                    <div className="group">
                      <label className="block text-sm font-semibold text-green-200 mb-2">
                        Min Floor 🏗️
                      </label>
                      <input
                        name="prefMinFloor"
                        type="number"
                        min="0"
                        value={formData.prefMinFloor}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300"
                        placeholder="1"
                      />
                    </div>
                    
                    <div className="group">
                      <label className="block text-sm font-semibold text-green-200 mb-2">
                        Max Floor 🏗️
                      </label>
                      <input
                        name="prefMaxFloor"
                        type="number"
                        min="0"
                        value={formData.prefMaxFloor}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300"
                        placeholder="10"
                      />
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    ✨ Dream Features
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-purple-200 mb-2">
                        Must-Have Features 💫
                      </label>
                      <input
                        name="prefTagsWanted"
                        type="text"
                        value={formData.prefTagsWanted}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
                        placeholder="parking, balcony, elevator, AC"
                      />
                      <p className="text-xs text-purple-300 mt-1">Separate with commas</p>
                    </div>
                    
                    <div className="group">
                      <label className="block text-sm font-semibold text-purple-200 mb-2">
                        Deal Breakers 🚫
                      </label>
                      <input
                        name="prefTagsExcluded"
                        type="text"
                        value={formData.prefTagsExcluded}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
                        placeholder="ground floor, no parking, no pets"
                      />
                      <p className="text-xs text-purple-300 mt-1">Separate with commas</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      What matters most? 🎯
                    </label>
                    <select
                      name="prefPriority"
                      value={formData.prefPriority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
                    >
                      <option value="" className="bg-gray-800">What's your priority?</option>
                      <option value="price" className="bg-gray-800">💰 Best Price</option>
                      <option value="location" className="bg-gray-800">📍 Best Location</option>
                      <option value="size" className="bg-gray-800">📐 Largest Space</option>
                      <option value="features" className="bg-gray-800">✨ Most Features</option>
                      <option value="balanced" className="bg-gray-800">⚖️ Balanced</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-8">
                  <button
                    onClick={prevStep}
                    className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
                  >
                    <span className="flex items-center">
                      <span className="mr-2 group-hover:-translate-x-1 transition-transform duration-300">←</span>
                      Back
                    </span>
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="group relative px-12 py-4 bg-gradient-to-r from-pink-600 to-yellow-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Magic...
                        </>
                      ) : (
                        <>
                          🚀 Start My Journey!
                          <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">✨</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Login Link */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="text-center">
                <p className="text-blue-200">
                  Already have an account?{' '}
                  <button
                    onClick={goToLogin}
                    className="font-bold text-transparent bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text hover:from-pink-300 hover:to-yellow-300 transition-all duration-300"
                  >
                    Sign in here 🌟
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional floating elements */}
      <div className="fixed top-20 right-20 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-pulse hidden lg:block"></div>
      <div className="fixed bottom-32 right-32 w-2 h-2 bg-pink-400 rounded-full opacity-40 animate-bounce hidden lg:block" style={{animationDelay: '1s'}}></div>
      <div className="fixed top-1/3 left-16 w-3 h-3 bg-blue-400 rounded-full opacity-50 animate-pulse hidden lg:block" style={{animationDelay: '2s'}}></div>
    </div>
  );
};

export default RegisterPage;