import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { CreateSpaceData } from '../../types';
import { X, Home, Car, MapPin, DollarSign, FileText, Loader } from 'lucide-react';

interface CreateSpaceModalProps {
  onClose: () => void;
  onSpaceCreated: () => void;
}

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({ onClose, onSpaceCreated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateSpaceData>({
    type: 'room',
    title: '',
    location: '',
    rate_per_hour: 0,
    description: '',
    availability: 'available',
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('dimensions.')) {
      const dimensionKey = name.split('.')[1] as keyof typeof formData.dimensions;
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions!,
          [dimensionKey]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'rate_per_hour' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim() || formData.rate_per_hour <= 0) {
      alert('Please fill in all required fields with valid data');
      return;
    }

    // Additional validation for parking spaces
    if (formData.type === 'parking') {
      if (!formData.dimensions || formData.dimensions.length <= 0 || formData.dimensions.width <= 0 || formData.dimensions.height <= 0) {
        alert('Please provide valid dimensions for the parking space');
        return;
      }
    }

    setLoading(true);
    try {
      const spaceData = formData.type === 'parking' ? formData : { ...formData, dimensions: undefined };
      await api.createSpace(spaceData, user.id);
      onSpaceCreated();
    } catch (error) {
      console.error('Error creating space:', error);
      alert('Failed to create space. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Add New Space</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Space Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Space Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'room' }))}
                  className={`flex items-center justify-center space-x-3 p-4 rounded-xl border-2 transition-colors ${
                    formData.type === 'room'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Room</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'parking' }))}
                  className={`flex items-center justify-center space-x-3 p-4 rounded-xl border-2 transition-colors ${
                    formData.type === 'parking'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Car className="w-5 h-5" />
                  <span className="font-medium">Parking</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                placeholder="e.g., Cozy Downtown Room or Secure Parking Space"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Manhattan, Brooklyn, Downtown NYC"
                />
              </div>
            </div>

            {/* Rate */}
            <div>
              <label htmlFor="rate_per_hour" className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="rate_per_hour"
                  name="rate_per_hour"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.rate_per_hour}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                Availability Status
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="available">Available</option>
                <option value="on_hold">On Hold</option>
                <option value="not_available">Not Available</option>
              </select>
            </div>

            {/* Parking Dimensions */}
            {formData.type === 'parking' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Parking Dimensions (Required for Parking Spaces)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="dimensions.length" className="block text-xs font-medium text-gray-600 mb-1">
                      Length (ft) *
                    </label>
                    <input
                      id="dimensions.length"
                      name="dimensions.length"
                      type="number"
                      min="0"
                      step="0.1"
                      required
                      value={formData.dimensions?.length || ''}
                      onChange={handleInputChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-sm"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label htmlFor="dimensions.width" className="block text-xs font-medium text-gray-600 mb-1">
                      Width (ft) *
                    </label>
                    <input
                      id="dimensions.width"
                      name="dimensions.width"
                      type="number"
                      min="0"
                      step="0.1"
                      required
                      value={formData.dimensions?.width || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-sm"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label htmlFor="dimensions.height" className="block text-xs font-medium text-gray-600 mb-1">
                      Height (ft) *
                    </label>
                    <input
                      id="dimensions.height"
                      name="dimensions.height"
                      type="number"
                      min="0"
                      step="0.1"
                      required
                      value={formData.dimensions?.height || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-sm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Provide accurate dimensions to help guests determine if their vehicle will fit.
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Describe your space, amenities, nearby attractions, etc."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Space</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSpaceModal;