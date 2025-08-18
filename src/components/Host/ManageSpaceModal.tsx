import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Space, Interest } from '../../types';
import { X, MapPin, Home, Car, Users, Mail, Clock, Settings, AlertTriangle, Edit, Save, FileText } from 'lucide-react';
import { Check, X as XIcon } from 'lucide-react';
import ReportModal from '../Common/ReportModal';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface ManageSpaceModalProps {
  space: Space;
  onClose: () => void;
  onSpaceUpdated: () => void;
  interestCount: number;
}

const ManageSpaceModal: React.FC<ManageSpaceModalProps> = ({ space, onClose, onSpaceUpdated, interestCount }) => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingUser, setReportingUser] = useState<Interest | null>(null);
  const [respondingToId, setRespondingToId] = useState<number | null>(null);
  
  const [editFormData, setEditFormData] = useState({
    title: space.title,
    location: space.location,
    latitude: space.latitude,
    longitude: space.longitude,
    rate_per_hour: space.rate_per_hour,
    description: space.description,
    dimensions: space.dimensions || { length: 0, width: 0, height: 0 }
  });

  const defaultCenter: [number, number] = [
    space.latitude ?? 23.8103,
    space.longitude ?? 90.4125
  ];
  const markerPosition: [number, number] | null =
    editFormData.latitude !== undefined && editFormData.longitude !== undefined
      ? [editFormData.latitude, editFormData.longitude]
      : null;

  const loadInterests = async () => {
    setLoading(true);
    try {
      const data = await api.getSpaceInterests(space.id);
      setInterests(data);
    } catch (error) {
      console.error('Error loading interests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterests();
  }, [space.id]);

  const handleUpdateAvailability = async (newAvailability: Space['availability']) => {
    setUpdatingAvailability(true);
    try {
      await api.updateSpaceAvailability(space.id, newAvailability);
      onSpaceUpdated();
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('dimensions.')) {
      const dimensionKey = name.split('.')[1] as keyof typeof editFormData.dimensions;
      setEditFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionKey]: parseFloat(value) || 0
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: name === 'rate_per_hour' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const ClickPicker: React.FC = () => {
    useMapEvents({
      click(e: L.LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        setEditFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
      }
    });
    return null;
  };

  const handleSaveChanges = async () => {
    // Validation
    if (!editFormData.title.trim() || !editFormData.location.trim() || !editFormData.description.trim() || editFormData.rate_per_hour <= 0) {
      alert('Please fill in all required fields with valid data');
      return;
    }

    // Additional validation for parking spaces
    if (space.type === 'parking') {
      if (editFormData.dimensions.length <= 0 || editFormData.dimensions.width <= 0 || editFormData.dimensions.height <= 0) {
        alert('Please provide valid dimensions for the parking space');
        return;
      }
    }

    setUpdating(true);
    try {
      const updateData = space.type === 'parking' ? editFormData : { ...editFormData, dimensions: undefined };
      console.log(updateData);
      await api.updateSpace(space.id, updateData);
      setIsEditing(false);
      onSpaceUpdated();
    } catch (error) {
      console.error('Error updating space:', error);
      alert('Failed to update space. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditFormData({
      title: space.title,
      location: space.location,
      latitude: space.latitude,
      longitude: space.longitude,
      rate_per_hour: space.rate_per_hour,
      description: space.description,
      dimensions: space.dimensions || { length: 0, width: 0, height: 0 }
    });
    setIsEditing(false);
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

  const handleReportUser = (interest: Interest) => {
    setReportingUser(interest);
    setShowReportModal(true);
  };

  const handleRespondToInterest = async (interestId: number, status: 'accepted' | 'rejected') => {
    setRespondingToId(interestId);
    try {
      await api.respondToInterest(interestId, status);
      loadInterests(); // Reload interests to show updated status
    } catch (error) {
      console.error('Error responding to interest:', error);
    } finally {
      setRespondingToId(null);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {space.type === 'room' ? (
              <Home className="w-6 h-6 text-blue-600" />
            ) : (
              <Car className="w-6 h-6 text-cyan-600" />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{space.title}</h2>
              <div className="flex items-center space-x-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{space.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[70vh]">
          {/* Space Details */}
          <div className="lg:w-1/2 p-6 border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>{isEditing ? 'Edit Space Details' : 'Space Details'}</span>
            </h3>

            {isEditing ? (
              /* Edit Form */
              <div className="space-y-6">
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
                    value={editFormData.title}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Cozy Downtown Room"
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
                      value={editFormData.location}
                      onChange={handleEditInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g., Manhattan, Brooklyn"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-gray-600 mb-2">Optionally adjust exact spot on the map</div>
                    <div className="h-64 rounded-xl overflow-hidden border border-gray-200">
                      <MapContainer center={markerPosition || defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ClickPicker />
                        {markerPosition && (
                          <Marker position={markerPosition} icon={new L.Icon.Default()} />
                        )}
                      </MapContainer>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {editFormData.latitude !== undefined && editFormData.longitude !== undefined ? (
                        <span>Lat: {editFormData.latitude.toFixed(6)}, Lng: {editFormData.longitude.toFixed(6)}</span>
                      ) : (
                        <span>Click on the map to set coordinates</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rate */}
                <div>
                  <label htmlFor="rate_per_hour" className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate *
                  </label>
                  <div className="relative">
                    {/* <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                    <span className="w-2 h-7 inline-block text-lg font-semibold">৳</span>
                    <input
                      id="rate_per_hour"
                      name="rate_per_hour"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={editFormData.rate_per_hour}
                      onChange={handleEditInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>

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
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      rows={4}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Describe your space, amenities, etc."
                    />
                  </div>
                </div>

                {/* Parking Dimensions */}
                {space.type === 'parking' && (
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
                          value={editFormData.dimensions.length || ''}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
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
                          value={editFormData.dimensions.width || ''}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
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
                          value={editFormData.dimensions.height || ''}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                          placeholder="8"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Provide accurate dimensions to help guests determine if their vehicle will fit.
                    </p>
                  </div>
                )}

                {/* Save/Cancel Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={updating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div>
                {/* Current Status */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                  <span className={`inline-block text-sm font-medium px-3 py-2 rounded-full border ${getAvailabilityColor(space.availability)}`}>
                    {getAvailabilityText(space.availability)}
                  </span>
                </div>

                {/* Rate */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                  <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    {/* <DollarSign className="w-5 h-5" /> */}
                    <span className="w-2 h-7 inline-block text-lg font-semibold"><b>৳</b></span>
                    <span>{space.rate_per_hour}/hour</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">{space.description}</p>
                </div>

                {/* Parking Dimensions */}
                {space.type === 'parking' && space.dimensions && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parking Dimensions</label>
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

                {/* Update Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Update Availability</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['available', 'on_hold', 'not_available'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateAvailability(status as Space['availability'])}
                        disabled={updatingAvailability || space.availability === status}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          space.availability === status
                            ? getAvailabilityColor(status as Space['availability'])
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updatingAvailability && space.availability !== status ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              status === 'available' ? 'bg-green-500' :
                              status === 'on_hold' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span>{getAvailabilityText(status as Space['availability'])}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interested Users */}
          <div className="lg:w-1/2 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Interested Users ({interestCount})</span>
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : interests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-600">No interests yet</p>
                <p className="text-gray-500 text-sm mt-1">Users who express interest will appear here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-gray-100">
                {interests.map((interest) => (
                  <div key={interest.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-cyan-700 font-medium text-sm">
                              {interest.user_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{interest.user_name}</p>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span>{interest.user_email}</span>
                            </div>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            interest.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            interest.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {interest.status === 'accepted' ? 'Accepted' :
                             interest.status === 'rejected' ? 'Rejected' : 'Pending'}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          {interest.hours_requested && (
                            <div className="flex items-center space-x-1 text-sm text-blue-600 font-medium">
                              <Clock className="w-3 h-3" />
                              <span>Wants {interest.hours_requested} hours</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>Interested on {new Date(interest.timestamp).toLocaleDateString()}</span>
                          </div>
                          {interest.host_response_date && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Responded on {new Date(interest.host_response_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-2">
                        {interest.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleRespondToInterest(interest.id, 'accepted')}
                              disabled={respondingToId === interest.id}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Accept request"
                            >
                              {respondingToId === interest.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRespondToInterest(interest.id, 'rejected')}
                              disabled={respondingToId === interest.id}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject request"
                            >
                              {respondingToId === interest.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <XIcon className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleReportUser(interest)}
                          className="p-2 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Report this user"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && reportingUser && (
        <ReportModal
          onClose={() => {
            setShowReportModal(false);
            setReportingUser(null);
          }}
          targetRole="guest"
          preselectedUserId={reportingUser.user_id}
        />
      )}
    </div>
  );
};

export default ManageSpaceModal;