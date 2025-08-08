import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Home } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('auth');
  };

  if (!user) return null;

  // Don't show header for admin users
  if (user.role === 'admin') return null;

  const navItems = user.role === 'guest'
    ? [
        { key: 'dashboard', label: 'Browse', icon: Home }
      ]
    : [
        { key: 'host-dashboard', label: 'My Listings', icon: Home }
      ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate(user.role === 'guest' ? 'dashboard' : 'host-dashboard')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">JIRAO</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === key
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <button
                onClick={() => onNavigate('profile')}
                className="flex flex-col text-left hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900 hover:text-blue-600">{user.username}</span>
                <span className="text-xs text-gray-500 capitalize">{user.role}</span>
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <nav className="flex justify-around">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  currentPage === key
                   ? 'text-cyan-700'
                   : 'text-gray-700 hover:text-cyan-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;