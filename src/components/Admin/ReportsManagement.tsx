import React, { useState } from 'react';
import { api } from '../../services/api';
import { Report } from '../../types';
import { AlertTriangle, User, Mail, Clock, Ban, Eye, Home, Car } from 'lucide-react';

interface ReportsManagementProps {
  reports: Report[];
  onUserAction: () => void;
}

const ReportsManagement: React.FC<ReportsManagementProps> = ({ reports, onUserAction }) => {
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleBanUser = async (userId: number) => {
    setActionLoading(userId);
    try {
      await api.banUser(userId);
      onUserAction();
    } catch (error) {
      console.error('Error banning user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleColor = (role: 'guest' | 'host') => {
    return role === 'guest' 
      ? 'bg-blue-100 text-blue-700' 
      : 'bg-green-100 text-green-700';
  };

  return (
    <div className="space-y-6">
      {reports.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600">All reports will appear here for review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Report Header */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Report #{report.id}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Details</span>
                    </button>
                    
                    <button
                      onClick={() => handleBanUser(report.reported_id)}
                      disabled={actionLoading === report.reported_id}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {actionLoading === report.reported_id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Ban className="w-4 h-4" />
                          <span>Ban</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="p-6">
                {/* Property Information (if available) */}
                {report.reason.includes('(Listing:') && (
                  <div className="bg-cyan-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      {report.reason.toLowerCase().includes('parking') ? (
                        <Car className="w-5 h-5 text-cyan-600" />
                      ) : (
                        <Home className="w-5 h-5 text-cyan-600" />
                      )}
                      <h4 className="font-semibold text-cyan-900">Reported Property</h4>
                    </div>
                    <p className="text-cyan-800 font-medium">
                      {report.reason.split('(Listing: ')[1]?.split(')')[0] || 'Property details not available'}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Reporter Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Reporter</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleColor(report.reporter_role)}`}>
                        {report.reporter_role}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 mb-1">{report.reporter_name}</p>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      <span>{report.reporter_email}</span>
                    </div>
                  </div>

                  {/* Reported User Info */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Reported User</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                        report.reported_role === 'host' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-cyan-100 text-cyan-700 border-cyan-200'
                      }`}>
                        {report.reported_role}
                      </span>
                    </div>
                    <p className="font-semibold text-blue-900 mb-1">{report.reported_name}</p>
                    <div className="flex items-center space-x-1 text-sm text-blue-700">
                      <Mail className="w-3 h-3" />
                      <span>{report.reported_email}</span>
                    </div>
                  </div>
                </div>

                {/* Report Reason */}
                <div className="bg-cyan-50 rounded-xl p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">Report Reason</h4>
                  <p className="text-cyan-800 leading-relaxed">
                    {report.reason.split('(Listing:')[0].trim()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reporter Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Reporter Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedReport.reporter_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedReport.reporter_email}</p>
                    <p><span className="font-medium">Role:</span> 
                      <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${getRoleColor(selectedReport.reporter_role)}`}>
                        {selectedReport.reporter_role}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Reported User Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Reported User Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedReport.reported_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedReport.reported_email}</p>
                    <p><span className="font-medium">Role:</span> 
                      <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${getRoleColor(selectedReport.reported_role)}`}>
                        {selectedReport.reported_role}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Report Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Report ID:</span> #{selectedReport.id}</p>
                  <p><span className="font-medium">Date:</span> {new Date(selectedReport.timestamp).toLocaleString()}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Reason for Report</h3>
                <p className="text-gray-700 leading-relaxed">{selectedReport.reason}</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex space-x-3">
              <button
                onClick={() => setSelectedReport(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleBanUser(selectedReport.reported_id);
                  setSelectedReport(null);
                }}
                disabled={actionLoading === selectedReport.reported_id}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {actionLoading === selectedReport.reported_id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Ban className="w-4 h-4" />
                    <span>Ban User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;