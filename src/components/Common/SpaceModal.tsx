import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import React, { useState } from 'react';
import { X, MapPin, Users, Calendar, Clock, Star, Flag, DollarSign, Home, Car } from 'lucide-react';
import { Space } from '../../types';

interface SpaceModalProps {
  space: Space;
  onClose: () => void;
  userRole?: 'guest' | 'host' | 'admin';
}

const SpaceModal: React.FC<SpaceModalProps> = ({ space, onClose, userRole = 'guest' }) => {
  const { user } = useAuth();
  const [hoursRequested, setHoursRequested] = useState<number | undefined>(undefined);
  const [expressing, setExpressing] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  const handleExpressInterest = async () => {
    if (!user) return;
    
    setExpressing(true);
    try {
      await api.expressInterest(space.id, user.id, hoursRequested);
      alert('Interest expressed successfully!');
      onClose();
    } catch (error) {
      console.error('Error expressing interest:', error);
      alert('Error expressing interest');
    } finally {
      setExpressing(false);
    }
  };

  const getAvailabilityColor = (availability: Space['availability']) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_available':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailabilityText = (availability: Space['availability']) => {
    switch (availability) {
      case 'available':
        return 'Available Now';
      case 'on_hold':
        return 'On Hold';
      case 'not_available':
        return 'Not Available';
      default:
        return 'Unknown';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Space Image Placeholder */}
        <div className="relative bg-gradient-to-br from-blue-100 to-cyan-100 h-64 rounded-t-xl flex items-center justify-center">
          {space.type === 'room' ? (
            <Home className="w-24 h-24 text-blue-600 opacity-50" />
          ) : (
            <Car className="w-24 h-24 text-cyan-600 opacity-50" />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{space.title}</h2>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{space.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                ${space.rate_per_hour}
                <span className="text-sm font-normal text-gray-500">/hour</span>
              </div>
            </div>
          </div>

          {/* Space Type and Availability */}
          <div className="mb-4 flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {space.type === 'room' ? (
                <Home className="w-4 h-4 text-blue-600" />
              ) : (
                <Car className="w-4 h-4 text-cyan-600" />
              )}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                space.type === 'parking' 
                  ? 'bg-cyan-100 text-cyan-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {space.type === 'parking' ? 'Parking Space' : 'Room'}
              </span>
            </div>
            
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getAvailabilityColor(space.availability)}`}>
              {getAvailabilityText(space.availability)}
            </span>
          </div>

          {/* Parking Dimensions */}
          {space.type === 'parking' && space.dimensions && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Parking Dimensions</h3>
              <div className="bg-cyan-50 rounded-lg p-3">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-cyan-700">{space.dimensions.length} ft</p>
                    <p className="text-cyan-600 text-xs">Length</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-cyan-700">{space.dimensions.width} ft</p>
                    <p className="text-cyan-600 text-xs">Width</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-cyan-700">{space.dimensions.height} ft</p>
                    <p className="text-cyan-600 text-xs">Height</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rate Display */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              {/* <DollarSign className="w-5 h-5" /> */}
              <span className="w-5 h-5 inline-block text-lg font-semibold">TK</span>

              <span>৳{space.rate_per_hour}/hour</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{space.description}</p>
          </div>

          {/* Host Info */}
          <div className="border-t pt-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Host</h3>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-semibold text-sm">
                  {space.owner_name?.charAt(0).toUpperCase() || 'H'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{space.owner_name || 'Host'}</p>
                <p className="text-sm text-gray-500">Verified Host</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {userRole === 'guest' && space.availability === 'available' && (
            <div className="space-y-4">
              {/* Hours Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many hours do you need? (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={hoursRequested || ''}
                  onChange={(e) => setHoursRequested(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter hours (e.g., 3)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if you're not sure about the duration
                </p>
              </div>
              
              <button
                onClick={handleExpressInterest}
                disabled={expressing}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {expressing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Expressing Interest...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Express Interest
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* Not Available Message */}
          {userRole === 'guest' && space.availability !== 'available' && (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600 font-medium">
                This space is currently {space.availability === 'on_hold' ? 'on hold' : 'not available'}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Check back later or browse other available spaces
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceModal;