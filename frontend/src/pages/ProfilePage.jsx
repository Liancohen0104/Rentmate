// pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  // You'll need to import these:
   const navigate = useNavigate();
   const { user, logout, isAuthenticated } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load profile');
      }

      setProfileData(data.user);
      setEditData(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setEditData(profileData);
    }
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Process arrays like in registration
      const processedData = {
        ...editData,
        prefTagsWanted: (editData.prefTagsWanted && typeof editData.prefTagsWanted === 'string') 
          ? editData.prefTagsWanted.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
          : editData.prefTagsWanted || [],
          
        prefTagsExcluded: (editData.prefTagsExcluded && typeof editData.prefTagsExcluded === 'string')
          ? editData.prefTagsExcluded.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
          : editData.prefTagsExcluded || [],
      };

      const response = await fetch('http://localhost:4000/users/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfileData(data.user);
      setEditMode(false);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/20 p-6 rounded-xl mb-4 mx-auto w-20 h-20 flex items-center justify-center">
            <span className="text-white font-bold text-3xl">👤</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-white">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
         <div className="relative z-10 min-h-screen pt-16"> {/* Added pt-16 */}
        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {profileData && (
            <>
              <div className="text-center mb-8">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-emerald-200">Member since {new Date(profileData.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-2xl">
                  <p className="text-red-200 text-center">{error}</p>
                </div>
              )}

              {/* Profile Content */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  <button
                    onClick={handleEditToggle}
                    disabled={isSaving}
                    className="px-6 py-2 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      👤 Personal Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-emerald-200 mb-1">First Name</label>
                          {editMode ? (
                            <input
                              name="firstName"
                              value={editData.firstName || ''}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          ) : (
                            <p className="text-white bg-white/5 px-3 py-2 rounded-lg">{profileData.firstName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-emerald-200 mb-1">Last Name</label>
                          {editMode ? (
                            <input
                              name="lastName"
                              value={editData.lastName || ''}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          ) : (
                            <p className="text-white bg-white/5 px-3 py-2 rounded-lg">{profileData.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-emerald-200 mb-1">Email</label>
                        <p className="text-white bg-white/5 px-3 py-2 rounded-lg">{profileData.email}</p>
                        <p className="text-xs text-emerald-300 mt-1">Email cannot be changed</p>
                      </div>
                    </div>
                  </div>

                  {/* Search Preferences */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      🏠 Search Preferences
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-emerald-200 mb-1">Preferred City</label>
                          {editMode ? (
                            <input
                              name="preferredCity"
                              value={editData.preferredCity || ''}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Tel Aviv, Jerusalem..."
                            />
                          ) : (
                            <p className="text-white bg-white/5 px-3 py-2 rounded-lg">{profileData.preferredCity || 'Not specified'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-emerald-200 mb-1">Neighborhood</label>
                          {editMode ? (
                            <input
                              name="preferredNeighborhood"
                              value={editData.preferredNeighborhood || ''}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Center, Florentin..."
                            />
                          ) : (
                            <p className="text-white bg-white/5 px-3 py-2 rounded-lg">{profileData.preferredNeighborhood || 'Not specified'}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-emerald-200 mb-1">Price Range</label>
                          <div className="flex space-x-2">
                            {editMode ? (
                              <>
                                <input
                                  name="prefMinPrice"
                                  type="number"
                                  value={editData.prefMinPrice || ''}
                                  onChange={handleInputChange}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  placeholder="Min"
                                />
                                <input
                                  name="prefMaxPrice"
                                  type="number"
                                  value={editData.prefMaxPrice || ''}
                                  onChange={handleInputChange}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  placeholder="Max"
                                />
                              </>
                            ) : (
                              <p className="text-white bg-white/5 px-3 py-2 rounded-lg w-full">
                                ₪{profileData.prefMinPrice || 0} - ₪{profileData.prefMaxPrice || 'No limit'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-emerald-200 mb-1">Rooms</label>
                          <div className="flex space-x-2">
                            {editMode ? (
                              <>
                                <input
                                  name="prefMinRooms"
                                  type="number"
                                  value={editData.prefMinRooms || ''}
                                  onChange={handleInputChange}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  placeholder="Min"
                                />
                                <input
                                  name="prefMaxRooms"
                                  type="number"
                                  value={editData.prefMaxRooms || ''}
                                  onChange={handleInputChange}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  placeholder="Max"
                                />
                              </>
                            ) : (
                              <p className="text-white bg-white/5 px-3 py-2 rounded-lg w-full">
                                {profileData.prefMinRooms || 0} - {profileData.prefMaxRooms || 'No limit'} rooms
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-emerald-200 mb-1">Priority</label>
                        {editMode ? (
                          <select
                            name="prefPriority"
                            value={editData.prefPriority || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="" className="bg-gray-800">Select priority</option>
                            <option value="price" className="bg-gray-800">Best Price</option>
                            <option value="location" className="bg-gray-800">Best Location</option>
                            <option value="size" className="bg-gray-800">Largest Space</option>
                            <option value="features" className="bg-gray-800">Most Features</option>
                            <option value="balanced" className="bg-gray-800">Balanced</option>
                          </select>
                        ) : (
                          <p className="text-white bg-white/5 px-3 py-2 rounded-lg capitalize">
                            {profileData.prefPriority || 'Not specified'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    ✨ Preferred Features
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-emerald-200 mb-2">Must-Have Features</label>
                      {editMode ? (
                        <input
                          name="prefTagsWanted"
                          value={Array.isArray(editData.prefTagsWanted) 
                            ? editData.prefTagsWanted.join(', ') 
                            : editData.prefTagsWanted || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="parking, balcony, elevator..."
                        />
                      ) : (
                        <div className="bg-white/5 px-3 py-2 rounded-lg min-h-[2.5rem] flex items-center">
                          {profileData.prefTagsWanted && profileData.prefTagsWanted.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {profileData.prefTagsWanted.map((tag, index) => (
                                <span key={index} className="bg-emerald-500/30 text-emerald-200 px-2 py-1 rounded text-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/70">No preferences set</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-emerald-200 mb-2">Deal Breakers</label>
                      {editMode ? (
                        <input
                          name="prefTagsExcluded"
                          value={Array.isArray(editData.prefTagsExcluded) 
                            ? editData.prefTagsExcluded.join(', ') 
                            : editData.prefTagsExcluded || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="ground floor, no parking..."
                        />
                      ) : (
                        <div className="bg-white/5 px-3 py-2 rounded-lg min-h-[2.5rem] flex items-center">
                          {profileData.prefTagsExcluded && profileData.prefTagsExcluded.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {profileData.prefTagsExcluded.map((tag, index) => (
                                <span key={index} className="bg-red-500/30 text-red-200 px-2 py-1 rounded text-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/70">No restrictions set</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save/Cancel Buttons */}
                {editMode && (
                  <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-white/20">
                    <button
                      onClick={handleEditToggle}
                      disabled={isSaving}
                      className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;