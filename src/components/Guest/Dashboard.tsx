import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Space } from '../../types';
import { Search, MapPin, Clock, Filter, Home, Car } from 'lucide-react';
import SpaceCard from '../Common/SpaceCard';
import SpaceModal from '../Common/SpaceModal';
import ReportModal from '../Common/ReportModal';

const Dashboard: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'room' | 'parking'>('all');

  const loadSpaces = async (location?: string) => {
    setLoading(true);
    try {
      const data = await api.getSpaces(location);
      setSpaces(data);
    } catch (error) {
      console.error('Error loading spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSpaces(searchLocation);
  };

  const filteredSpaces = typeFilter === 'all' 
    ? spaces 
    : spaces.filter(space => space.type === typeFilter);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Space</h1>
          <p className="text-gray-600">Discover rooms and parking spaces available for rent</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter location (e.g., Manhattan, Brooklyn)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              
              {/* Search Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setTypeFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === 'all'
                      ? 'bg-cyan-100 text-cyan-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Spaces
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter('room')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === 'room'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Rooms</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter('parking')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === 'parking'
                      ? 'bg-cyan-100 text-cyan-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Parking</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Available Spaces
                {searchLocation && (
                  <span className="text-gray-500 font-normal"> in {searchLocation}</span>
                )}
              </h2>
              <p className="text-gray-600">
                {filteredSpaces.length} space{filteredSpaces.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredSpaces.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No spaces found</h3>
                <p className="text-gray-600">
                  {searchLocation 
                    ? `Try searching in a different location or clear your search.`
                    : 'Try adjusting your filters or search in a specific location.'
                  }
                </p>
                {searchLocation && (
                  <button
                    onClick={() => {
                      setSearchLocation('');
                      loadSpaces();
                    }}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear search and view all spaces
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 pr-2">
                {filteredSpaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    onClick={() => setSelectedSpace(space)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Space Detail Modal */}
      {selectedSpace && (
        <SpaceModal
          space={selectedSpace}
          onClose={() => setSelectedSpace(null)}
          userRole="guest"
        />
      )}
    </div>
  );
};

export default Dashboard;