import React from 'react';
import { Space } from '../../types';
import { MapPin, DollarSign, Home, Car, Clock, AlertTriangle } from 'lucide-react';

interface SpaceCardProps {
  space: Space;
  onClick?: () => void;
  showAvailability?: boolean;
  showInterestCount?: boolean;
  interestCount?: number;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ 
  space, 
  onClick, 
  showAvailability = false, 
  showInterestCount = false,
  interestCount = 0
}) => {
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
        return 'Available';
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
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            {space.type === 'room' ? (
              <Home className="w-5 h-5 text-blue-600" />
            ) : (
              <Car className="w-5 h-5 text-green-600" />
            )}
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              space.type === 'room' 
                ? 'bg-blue-100 text-blue-700'
                : 'bg-cyan-100 text-cyan-700'
            }`}>
              {space.type === 'room' ? 'Room' : 'Parking'}
            </span>
          </div>
          
          {/* Always show availability status */}
          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getAvailabilityColor(space.availability)}`}>
            {getAvailabilityText(space.availability)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {space.title}
        </h3>

        {/* Location */}
        <div className="flex items-center space-x-1 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{space.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {space.description}
        </p>

        {/* Parking Dimensions */}
        {space.type === 'parking' && space.dimensions && (
          <div className="bg-cyan-50 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-cyan-800 mb-1">Dimensions</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-cyan-700">
              <div>
                <span className="font-medium">L:</span> {space.dimensions.length}ft
              </div>
              <div>
                <span className="font-medium">W:</span> {space.dimensions.width}ft
              </div>
              <div>
                <span className="font-medium">H:</span> {space.dimensions.height}ft
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-lg font-semibold text-gray-900">
            {/* <DollarSign className="w-4 h-4" /> */}
            <span className="w-2 h-7 inline-block text-lg font-semibold"><b>৳</b></span>

            <span>&nbsp;{space.rate_per_hour}</span>
            <span className="text-sm text-gray-500 font-normal">/hour</span>
          </div>

          {showInterestCount && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span>{interestCount} interested</span>
            </div>
          )}
        </div>

        {space.owner_name && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Listed by <span className="font-medium text-gray-700">{space.owner_name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceCard;