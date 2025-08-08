import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Interest } from '../../types';
import { User, Heart, Clock, MapPin, DollarSign, X, Trash2, Home, Car } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const loadInterests = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await api.getUserInterests(user.id);
      setInterests(data);
    } catch (error) {
      console.error('Error loading interests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterests();
  }, [user]);

  const handleCancelInterest = async (interestId: number) => {
    setCancellingId(interestId);
    try {
      await api.cancelInterest(interestId);
      setInterests(interests.filter(interest => interest.id !== interestId));
    } catch (error) {
      console.error('Error cancelling interest:', error);
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-1 px-3 py-1 bg-cyan-100 text-cyan-700 text-sm font-medium rounded-full capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Interest History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900">Interest History</h2>
            </div>
            <p className="text-gray-600 mt-1">Manage your space interests</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : interests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interests yet</h3>
                <p className="text-gray-600">
                  Browse available spaces and express interest to see them here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {interests.map((interest) => (
                  <div key={interest.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {interest.space_title?.includes('parking') || interest.space_title?.toLowerCase().includes('parking') ? (
                          <Car className="w-4 h-4 text-cyan-600" />
                        ) : (
                          <Home className="w-4 h-4 text-blue-600" />
                        )}
                        <h3 className="font-semibold text-gray-900">{interest.space_title}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          interest.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          interest.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {interest.status === 'accepted' ? 'Accepted' :
                           interest.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{interest.space_location}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>${interest.space_rate}/hour</span>
                        </div>
                        
                        {interest.hours_requested && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{interest.hours_requested}h requested</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(interest.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Response message */}
                      {interest.status !== 'pending' && interest.host_response_date && (
                        <div className={`mt-2 text-xs p-2 rounded-lg ${
                          interest.status === 'accepted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {interest.status === 'accepted' 
                            ? `✅ Request accepted on ${new Date(interest.host_response_date).toLocaleDateString()}`
                            : `❌ Request rejected on ${new Date(interest.host_response_date).toLocaleDateString()}`
                          }
                        </div>
                      )}
                    </div>
                    
                    {interest.status === 'pending' && (
                      <button
                        onClick={() => handleCancelInterest(interest.id)}
                        disabled={cancellingId === interest.id}
                        className="ml-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Cancel interest"
                      >
                        {cancellingId === interest.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;