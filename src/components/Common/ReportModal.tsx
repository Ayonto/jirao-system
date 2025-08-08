import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { User, CreateReportData } from '../../types';
import { X, AlertTriangle, User as UserIcon, Loader, Check } from 'lucide-react';

interface ReportModalProps {
  onClose: () => void;
  targetRole: 'host' | 'guest';
  preselectedUserId?: number;
  spaceId?: number;
  spaceTitle?: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose, targetRole, preselectedUserId, spaceId, spaceTitle }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<CreateReportData>({
    reported_id: preselectedUserId || 0,
    space_id: spaceId,
    reason: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await api.getUsersForReporting(user.id, targetRole);
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.reported_id || !formData.reason.trim()) return;

    setSubmitting(true);
    try {
      await api.createReport(formData, user.id);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedUser = users.find(u => u.id === formData.reported_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Report {targetRole === 'host' ? 'Host' : 'Guest'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Submitted</h3>
              <p className="text-gray-600">Thank you for your report. Our admin team will review it shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Space Context (if reporting from a listing) */}
              {spaceTitle && (
                <div className="bg-cyan-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-cyan-700 mb-1">Reporting about listing:</p>
                  <p className="font-medium text-cyan-900">{spaceTitle}</p>
                </div>
              )}

              {/* User Selection */}
              {!preselectedUserId ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select {targetRole === 'host' ? 'Host' : 'Guest'} to Report
                  </label>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No {targetRole}s available to report.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {users.map((reportUser) => (
                        <button
                          key={reportUser.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, reported_id: reportUser.id }))}
                          className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                            formData.reported_id === reportUser.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{reportUser.username}</p>
                              <p className="text-sm text-gray-600">{reportUser.email}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              {/* Selected User Display */}
              {selectedUser && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-700 mb-2">Reporting:</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">{selectedUser.username}</p>
                      <p className="text-sm text-blue-700">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reason for Report *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder={spaceTitle 
                    ? `Please describe the issue with this listing or the ${targetRole}...`
                    : `Please describe the issue or inappropriate behavior...`
                  }
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.reported_id || !formData.reason.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5" />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;