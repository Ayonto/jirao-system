import React, { useState } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';
import { User as UserIcon, Mail, Calendar, Ban, UserCheck, AlertTriangle, Grid, List } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onUserAction: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUserAction }) => {
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'guest' | 'host' | 'active' | 'banned'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

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

  const handleUnbanUser = async (userId: number) => {
    setActionLoading(userId);
    try {
      await api.unbanUser(userId);
      onUserAction();
    } catch (error) {
      console.error('Error unbanning user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    setActionLoading(userId);
    try {
      await api.deleteUser(userId);
      onUserAction();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => {
    switch (filter) {
      case 'guest':
        return user.role === 'guest';
      case 'host':
        return user.role === 'host';
      case 'active':
        return user.status === 'active';
      case 'banned':
        return user.status === 'banned';
      default:
        return true;
    }
  });

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'banned':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'guest':
        return 'bg-blue-100 text-blue-700';
      case 'host':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'guest', 'host', 'active', 'banned'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === filterOption
                  ? 'bg-cyan-100 text-cyan-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-cyan-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table'
              ? 'bg-white text-cyan-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">No users match the current filter criteria.</p>
        </div>
      ) : (
        <>
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-xl p-6 space-y-4">
                  {/* User Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.username}</h3>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Role:</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Joined:</span>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(user.date_joined).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleBanUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                        >
                          {actionLoading === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Ban className="w-4 h-4" />
                              <span>Ban User</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnbanUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                        >
                          {actionLoading === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4" />
                              <span>Unban User</span>
                            </>
                          )}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={actionLoading === user.id}
                        className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      >
                        {actionLoading === user.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4" />
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.date_joined).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {user.status === 'active' ? (
                              <button
                                onClick={() => handleBanUser(user.id)}
                                disabled={actionLoading === user.id}
                                className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                              >
                                {actionLoading === user.id ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <Ban className="w-3 h-3" />
                                    <span>Ban</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnbanUser(user.id)}
                                disabled={actionLoading === user.id}
                                className="bg-cyan-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                              >
                                {actionLoading === user.id ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <UserCheck className="w-3 h-3" />
                                    <span>Unban</span>
                                  </>
                                )}
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={actionLoading === user.id}
                              className="bg-gray-700 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                            >
                              {actionLoading === user.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Delete</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagement;