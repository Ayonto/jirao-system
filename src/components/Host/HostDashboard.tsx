import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Space } from '../../types';
import { Plus, Home, Car, Settings } from 'lucide-react';
import SpaceCard from '../Common/SpaceCard';
import CreateSpaceModal from './CreateSpaceModal';
import ManageSpaceModal from './ManageSpaceModal';

const HostDashboard: React.FC = () => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [interestCounts, setInterestCounts] = useState<{ [key: number]: number }>({});

  const loadSpaces = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await api.getHostSpaces(user.id);
      setSpaces(data);
      
      // Load interest counts for each space
      const counts: { [key: number]: number } = {};
      for (const space of data) {
        try {
          const interests = await api.getSpaceInterests(space.id);
          counts[space.id] = interests.length;
        } catch (error) {
          counts[space.id] = 0;
        }
      }
      setInterestCounts(counts);
    } catch (error) {
      console.error('Error loading spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, [user]);

  const handleSpaceCreated = () => {
    setShowCreateModal(false);
    loadSpaces();
  };

  const handleSpaceUpdated = () => {
    setSelectedSpace(null);
    loadSpaces();
  };

  if (!user) return null;

  const availableSpaces = spaces.filter(space => space.availability === 'available');
  const onHoldSpaces = spaces.filter(space => space.availability === 'on_hold');
  const unavailableSpaces = spaces.filter(space => space.availability === 'not_available');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
            <p className="text-gray-600">Manage your room and parking space rentals</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Space</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Listings</p>
                <p className="text-3xl font-bold text-gray-900">{spaces.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Available Now</p>
                <p className="text-3xl font-bold text-green-600">{availableSpaces.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Interest</p>
                <p className="text-3xl font-bold text-purple-600">
                  {Object.values(interestCounts).reduce((sum, count) => sum + count, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : spaces.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">
              Start earning by listing your first room or parking space.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Listing</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Available Spaces */}
            {availableSpaces.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span>Available ({availableSpaces.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100 pr-2">
                  {availableSpaces.map((space) => (
                    <SpaceCard
                      key={space.id}
                      space={space}
                      onClick={() => setSelectedSpace(space)}
                      showInterestCount={true}
                      interestCount={interestCounts[space.id] || 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* On Hold Spaces */}
            {onHoldSpaces.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>On Hold ({onHoldSpaces.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-gray-100 pr-2">
                  {onHoldSpaces.map((space) => (
                    <SpaceCard
                      key={space.id}
                      space={space}
                      onClick={() => setSelectedSpace(space)}
                      showInterestCount={true}
                      interestCount={interestCounts[space.id] || 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Not Available Spaces */}
            {unavailableSpaces.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Not Available ({unavailableSpaces.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-gray-100 pr-2">
                  {unavailableSpaces.map((space) => (
                    <SpaceCard
                      key={space.id}
                      space={space}
                      onClick={() => setSelectedSpace(space)}
                      showInterestCount={true}
                      interestCount={interestCounts[space.id] || 0}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Space Modal */}
      {showCreateModal && (
        <CreateSpaceModal
          onClose={() => setShowCreateModal(false)}
          onSpaceCreated={handleSpaceCreated}
        />
      )}

      {/* Manage Space Modal */}
      {selectedSpace && (
        <ManageSpaceModal
          space={selectedSpace}
          onClose={() => setSelectedSpace(null)}
          onSpaceUpdated={handleSpaceUpdated}
          interestCount={interestCounts[selectedSpace.id] || 0}
        />
      )}
    </div>
  );
};

export default HostDashboard;