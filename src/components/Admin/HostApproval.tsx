import React, { useState } from 'react';
import { api } from '../../services/api';
import { PendingHost } from '../../types';
import { UserCheck, X, Calendar, Mail, Image, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HostApprovalProps {
  pendingHosts: PendingHost[];
  onHostAction: () => void;
}

const HostApproval: React.FC<HostApprovalProps> = ({ pendingHosts, onHostAction }) => {
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedHost, setSelectedHost] = useState<PendingHost | null>(null);

  const handleApproveHost = async (hostId: number) => {
    if (!user) return;
    setActionLoading(hostId);
    try {
      await api.approveHost(hostId, user.id);
      onHostAction();
    } catch (error) {
      console.error('Error approving host:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectHost = async (hostId: number) => {
    setActionLoading(hostId);
    try {
      await api.rejectHost(hostId);
      onHostAction();
    } catch (error) {
      console.error('Error rejecting host:', error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {pendingHosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending host applications</h3>
          <p className="text-gray-600">New host applications will appear here for approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingHosts.map((host) => (
            <div key={host.id} className="bg-gray-50 rounded-xl p-6 space-y-4">
              {/* Host Header */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{host.username}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    <span>{host.email}</span>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Applied:</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(host.date_applied).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">NID Document:</span>
                  <button
                    onClick={() => setSelectedHost(host)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Image className="w-3 h-3" />
                    <span>View</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex space-x-2">
                <button
                  onClick={() => handleApproveHost(host.id)}
                  disabled={actionLoading === host.id}
                  className="flex-1 bg-cyan-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {actionLoading === host.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleRejectHost(host.id)}
                  disabled={actionLoading === host.id}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {actionLoading === host.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NID Preview Modal */}
      {selectedHost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Host Application - {selectedHost.username}</h2>
              <button
                onClick={() => setSelectedHost(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Host Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Applicant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="font-medium text-gray-900">{selectedHost.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedHost.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Application Date</p>
                    <p className="font-medium text-gray-900">{new Date(selectedHost.date_applied).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* NID Document */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">National ID Document</h3>
                <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">NID Document Preview</p>
                    <img 
                      src={selectedHost.nid_image} 
                      alt="NID Document" 
                      className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.textContent = 'Unable to load NID image';
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-2">Sample NID document for demo purposes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex space-x-3">
              <button
                onClick={() => setSelectedHost(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleRejectHost(selectedHost.id);
                  setSelectedHost(null);
                }}
                disabled={actionLoading === selectedHost.id}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
              </button>
              <button
                onClick={() => {
                  handleApproveHost(selectedHost.id);
                  setSelectedHost(null);
                }}
                disabled={actionLoading === selectedHost.id}
                className="flex-1 bg-cyan-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Approve</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostApproval;