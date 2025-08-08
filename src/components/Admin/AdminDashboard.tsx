import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { User, Report, PendingHost } from '../../types';
import { Users, Shield, AlertTriangle, UserCheck, BarChart3, LogOut } from 'lucide-react';
import UserManagement from './UserManagement';
import ReportsManagement from './ReportsManagement';
import HostApproval from './HostApproval';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [currentTab, setCurrentTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [pendingHosts, setPendingHosts] = useState<PendingHost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, reportsData, pendingHostsData] = await Promise.all([
        api.getAllUsers(),
        api.getReports(),
        api.getPendingHosts()
      ]);
      
      setUsers(usersData);
      setReports(reportsData);
      setPendingHosts(pendingHostsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUserAction = () => {
    loadData();
  };

  const handleHostAction = () => {
    loadData();
  };

  const handleLogout = () => {
    logout();
  };

  const tabs = [
    { key: 'users', label: 'Users', icon: Users, count: users.length },
    { key: 'reports', label: 'Reports', icon: AlertTriangle, count: reports.length },
    { key: 'hosts', label: 'Host Approval', icon: UserCheck, count: pendingHosts.length }
  ];

  const activeUsers = users.filter(u => u.status === 'active').length;
  const bannedUsers = users.filter(u => u.status === 'banned').length;
  const totalGuests = users.filter(u => u.role === 'guest').length;
  const totalHosts = users.filter(u => u.role === 'host').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">JIRAO Platform Administration</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
          
          {/* Mobile Logout Button */}
          <div className="sm:hidden mt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Reports</p>
                <p className="text-3xl font-bold text-red-600">{reports.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Hosts</p>
                <p className="text-3xl font-bold text-orange-600">{pendingHosts.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(({ key, label, icon: Icon, count }) => (
                <button
                  key={key}
                  onClick={() => setCurrentTab(key)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    currentTab === key
                      ? 'border-cyan-500 text-cyan-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                  {count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      currentTab === key
                        ? 'bg-cyan-100 text-cyan-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
              </div>
            ) : (
              <>
                {currentTab === 'users' && (
                  <UserManagement users={users} onUserAction={handleUserAction} />
                )}
                {currentTab === 'reports' && (
                  <ReportsManagement reports={reports} onUserAction={handleUserAction} />
                )}
                {currentTab === 'hosts' && (
                  <HostApproval pendingHosts={pendingHosts} onHostAction={handleHostAction} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;